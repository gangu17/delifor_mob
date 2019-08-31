let cb;
const appImport = require('./app');
const app = appImport.app;
const helper = require('./util');
const multerFileUpload = require('./multerFileUpload');
const upload = multerFileUpload.upload;
const result = require('./result');
const db = require('./db').connect();
const mongoose= require('mongoose');
const userModel = require('./model').user;



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
    app.post('/profileimageupload', upload.any(), function (req, res, next) {
        console.log(JSON.stringify(req.apiGateway.event));
        const event = req.apiGateway.event;
        const driverCognitoSub= event.requestContext.authorizer.claims.sub;
        console.log('driverCognitoSub',driverCognitoSub);
        result.addHeader(res);

      /*  console.log(req.file);

        let fileUrl = req.file.key;
*/
      /*  const principals = helper.getPrincipals(res, event);
        if (!principals) return;

        const clientId = (helper.isAdmin(principals)) ? principals['sub'] : principals['clientId'];
        console.log('clientId ' + clientId);*/
        //req.apiGateway.event

        //type=1 image
        //type=2 signature

        let images = [];
        if (req.files.length) {
            console.log(req.files.length);
            for (let i = 0; i < req.files.length; i++) {
                console.log('entering for loop');
                images.push(req.files[i].location);
            }
            // req.body.driverImages = images;
            console.log('images',images);
            return checkDriverProfileImage(driverCognitoSub,images[0],userModel)
                     .then((finalOutput)=>{
                     console.log('finalOutput....',finalOutput);
                       res.json({'statusCode':200,'message':'Driver new image is uplodaed',imageUrl:images[0]});
                     })



        }

        else{
            res.send(JSON.stringify({status: 200, 'message':'files are empty'}));
        }
    });


function checkDriverProfileImage(driverCognitoSub,newImage,userModel){
    console.log('driverCognitoSub',driverCognitoSub);
    return userModel.findOne({cognitoSub:driverCognitoSub})
        .then((driverData)=>{


            console.log('DriverInfo',JSON.stringify(driverData))

            return checkImageExistOrNot(driverData,newImage,userModel)

        }).catch((err)=>{
           console.log('err',err);
            return Promise.reject(err);
        })
}


function checkImageExistOrNot(driverData,newImage,userModel){
    console.log('check Imahe exist');
    console.log('driverInfo',JSON.stringify(driverData));
    let promiseArry=[updateDriverInfo(driverData._id,newImage,userModel)];
    if(driverData.image){
        promiseArry.push(removeFile(driverData.image));
    }
    return Promise.all(promiseArry)

}

function updateDriverInfo(driverId,newImage,userModel) {
    console.log('driver._Id',driverId,newImage);
    return userModel.update({'_id':mongoose.Types.ObjectId(driverId)},{$set:{image:newImage}})

}


function removeFile(oldImage) {
    let imageArry= oldImage.split("/");
    let length= imageArry.length;
    let imageName=imageArry[length-1];
    console.log('imageName', imageName);
    multerFileUpload.removeFile(imageName);
}


module.exports = app;