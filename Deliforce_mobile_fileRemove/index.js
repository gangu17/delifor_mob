let cb;
const result = require('./result');


try {
    const getConstant = require('./constant')();
    // const callback = function (err, data) {
    //   console.log('callback called+++++++++++++++++++++++++++++++++');
    //   console.log(err, data);
    // };
    //const event={};
    //event.body={'_id':'5b56b44a5924da80f761bd0e','image':"https://deliforce-mobile-fileupload.s3.ap-south-1.amazonaws.com/1532413504864profileimage-4733.jpg"};
    // const event = require('../../../mock').driver.event;
    // event.body = require('../../../mock').data.createNotes;
    exports.handler = (event, context, callback) => {
        console.log('event', event);
        cb = callback;
        context.callbackWaitsForEmptyEventLoop = false;
        getConstant.then(() => {
            //imports
            const multerFileUpload = require('./multerFileUpload');
            const removeFile = multerFileUpload.removeFile;
            const db = require('./db').connect();
            const task = require('./task');
            const helper = require('./util');
            if (helper.checkFromTrigger(cb, event)) return;
            const principals = event.requestContext.authorizer.claims.sub;
            if (!principals) return;
            let data = helper.getBodyData(event);
            if (data && data.image && data._id) {
                let imageUrl = data.image;
                let imageArry = data.image.split("/");
                let length = imageArry.length;
                let imageName = imageArry[length - 1];
                let taskId = data._id;
                console.log('imageName', imageName);
                removeFile(imageName).then(() => {
                    console.log('file removed successfull', data);
                    console.log('image', data.image);
                    console.log('taskId', taskId);
                    db.then(() => task.updateTasks(taskId, imageUrl, cb)).catch(sendError);
                });

                /*  AWS.config.update({
                      signatureVersion: 'v4',
                      "accessKeyId": "AKIAJ27DIZ63JPYNUJFA",
                      "secretAccessKey": "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"
                  });
                  let s3 = new AWS.S3({});
                  s3.deleteObject({
                      Bucket: 'deliforce-mobile-fileupload',
                      Key: imageName
                  },function (err,data){
                      if(err){
                          console.log(err);
                          result.sendServerError(cb);
                      }
                      else{
                          console.log('file removed successfull',data)
                          console.log('image',data.image);
                          console.log('taskId',taskId);
                          db.then(() => task.updateTasks(taskId,imageUrl,cb)).catch(sendError);
                      }
                  })
        */
            }
            else {
                result.sendSuccess(cb, JSON.stringify({
                    status: 200,
                    message: 'your sending empty images for deleting'
                }));
            }

            function sendError(error) {
                console.error('error +++', error);
                result.sendServerError(cb);
            }
        }).catch((err) => {
            console.log(err);
            result.sendServerError(cb);
        });
    };

} catch (err) {
    console.error('error +++', err);
    result.sendServerError(cb);
}







