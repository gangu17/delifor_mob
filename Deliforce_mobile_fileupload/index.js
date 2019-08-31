const appImport = require('./app');
const app = appImport.app;
const multerFileUpload = require('./multerFileUpload');
const upload = multerFileUpload.upload;
const removeFile = multerFileUpload.removeFile;
const mongoose = require('mongoose');
let _ = require('lodash');
const db = require('./db').connect();
const result = require('./result');
const taskModel = require('./model').task;
const userModel = require('./model').user;
const tasklogModel = require('./model').tasklog;




db.then(() => {
    console.log('data base connectionestablished');

    let server = app.listen(8082, function () {
        let host = server.address().address;
        let port = server.address().port;
        console.log("Example app listening at http://%s:%s", host, port);
    });
}).catch((error) => {
    console.log(error);
    process.exit(1)
});


// upload.any()
app.post('/fileupload', upload.any(), function (req, res, next) {
    console.log('in post call');
    console.log(JSON.stringify(req.apiGateway));
    const event = req.apiGateway.event;
    result.addHeader(res);
    //type=1 image
    //type=2 signature
    const driverCognitoSub = event.requestContext.authorizer.claims.sub;
    console.log('driverCognitoSub', driverCognitoSub);
    let images = [];
    console.log(req);
    if (req.files.length) {
        console.log(req.files.length);
        for (let i = 0; i < req.files.length; i++) {
            console.log('entering for loop');
            images.push(req.files[i].location);
        }
        // req.body.driverImages = images;
        console.log('images', images);
        console.log('req.body', req.body);
        const _id = req.body._id;
        delete req.body._id;
        const query = {_id: mongoose.Types.ObjectId(_id)};
        let data = (req.body.type === 'image') ? {driverImages: images} : {driverSignature: images[0]};
        let updateData = (data && data.driverImages) ? {'$push': data} : data;
        console.log('updatedData', updateData);
        return Promise.all([taskUpdate(taskModel, query, updateData), insertTaskLogDate(taskModel, tasklogModel, userModel, _id, driverCognitoSub, req.body.type, images)]).then((result) => {
            console.log(JSON.stringify(result[1]));
            return taskModel.findOne(query, {_id: 1, driverImages: 1, driverSignature: 1}).then((taskInfo) => {
                console.log('taskDetails', JSON.stringify(taskInfo));
                let taskResult = (taskInfo) ? taskInfo.toObject() : '';
                console.log(JSON.stringify({data: taskResult}));
                res.send(JSON.stringify(taskResult));
            })

        })
    }

    else {
        res.send(JSON.stringify({status: 200, 'message': 'files are empty'}));
    }
});



function taskUpdate(model, query, data) {
    return model.update(query, data, {
        upsert: true,
        setDefaultsOnInsert: true
    })
}

function insertTaskLogDate(taskmodel, tasklogmodel, userModel, taskId, driverId, actionType, images) {
    let obj = {}

    console.log('actionType', actionType);
    return Promise.all([adminDetails(taskmodel, taskId), driverDetails(userModel, driverId)])
        .then((final) => {
            console.log('finaloutput', final);
            obj = {
                'taskId': taskId,
                'taskStatus': (actionType == 'image') ? 11 : 12
            };
            Object.assign(obj, final[0], final[1], {imageArry: images});
            console.log(obj);
            return tasklogmodel.findOne({taskId: obj.taskId, imageArry: {$exists: true}, taskStatus: obj.taskStatus})
                .then((taskLog) => {
                    if (_.isEmpty(taskLog)) {

                        const newTaskLogModel = new tasklogmodel(obj);
                        return newTaskLogModel.save();
                    }
                    else {
                        return tasklogmodel.update({
                            taskId: obj.taskId,
                            imageArry: {$exists: true},
                            taskStatus: obj.taskStatus
                        }, {$push: {imageArry: images}})
                    }
                })

        })
        .catch((error) => {
            console.log(error)
        });
}

function adminDetails(taskmodel, taskId) {
    return taskmodel.aggregate([
        {$match: {'_id': mongoose.Types.ObjectId(taskId)}},
        {
            $lookup:
                {
                    from: "users",
                    localField: "user",
                    foreignField: "cognitoSub",
                    as: "adminDetails"
                }
        },
        {$unwind: "$adminDetails"}
    ]).then((output) => {
        console.log('output', output);
        console.log(output[0].adminDetails.name);
        return Promise.resolve({
            user: output[0].adminDetails.name, role: output[0].adminDetails.role
            , clientId: output[0].adminDetails.cognitoSub
        })
    }).catch((err) => {
        console.log(err)
    });
}

function driverDetails(userModel, driverId) {
    return userModel.findOne({cognitoSub: driverId})
        .then((output) => {
            console.log('driverDetails', JSON.stringify(output));
            let final = (output) ? output.toObject() : '';
            const driverName = (final) ? final.name : '';
            return Promise.resolve({'driverName': driverName})
        })
        .catch((err) => {
            console.log(err);
        })

}

module.exports = app;