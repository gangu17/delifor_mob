const appImport = require('./app');
const app = appImport.app;
const multerFileUpload = require('./multerFileUpload');
const upload = multerFileUpload.upload;
const removeFile = multerFileUpload.removeFile;
const mongoose = require('mongoose');
const taskModel = require('./model').task;
const db = require('./db').connect();
const tasklogModel = require('./model').tasklog;
const result = require('./result');



db.then(() => {
    console.log('data base connectionestablished');

    let server = app.listen(8082, function () {
        let host = server.address().address;
        let port = server.address().port;
        console.log("Example app listening at http://%s:%s", host, port);
    });
})
    .catch((error) => {
        console.log(error);
        process.exit(1)
    });


// upload.any()
app.put('/fileupload', upload.any(), function (req, res, next) {
    console.log(JSON.stringify(req.apiGateway));
    const event = req.apiGateway.event;
    result.addHeader(res);
    const driverCognitoSub = event.requestContext.authorizer.claims.sub;
    console.log('driverCognitoSub', driverCognitoSub);
    let images = [];
    if (req.files.length) {
        console.log(req.files.length);
        for (let i = 0; i < req.files.length; i++) {
            console.log('entering for loop');
            images.push(req.files[i].location);
        }
        console.log('images', images);
        console.log('req.body', req.body);
        if (req.body && req.body._id) {
                console.log('entering task info ');
                const _id = req.body._id;
                delete req.body._id;
                console.log('id', _id);
                const query = {_id: mongoose.Types.ObjectId(_id)};
                return taskModel.findOne(query).then((taskDetails) => {
                    console.log('taskDetails', taskDetails);
                    let taskInfo = (taskDetails) ? taskDetails.toObject() : '';
                    if (taskInfo) {
                        let oldSignature = taskInfo.driverSignature;
                        //res.send(oldSignature);
                        let newSignature = images[0];
                        return Promise.all([RemoveFileFromS3(oldSignature), updateTaskModel(taskModel, query, {driverSignature: newSignature}),
                            updateTaskLogModel(tasklogModel, {
                                taskId: _id,
                                taskStatus: '12'
                            }, {$set: {imageArry: newSignature}})
                        ]).then((finalOutput) => {
                                console.log('finalOutput', JSON.stringify(finalOutput));
                                res.send({'status': 200, driverSignature: images[0]})
                            })

                    }
                })

            }

    } else {
        res.send(JSON.stringify({status: 200, 'message': 'files are empty'}));
    }
});


function RemoveFileFromS3(fileUrl) {
    console.log(fileUrl[0]);
    let imageArry = fileUrl[0].split("/");
    let length = imageArry.length;
    let imageName = imageArry[length - 1];
    removeFile(imageName);
}

function updateTaskModel(model, query, data) {
    return model.update(query, data, {
        upsert: true,
        setDefaultsOnInsert: true
    })
}

function updateTaskLogModel(model, query, data) {
    return model.update(query, data, {upsert: true, setDefaultsOnInsert: true})
}


module.exports = app;