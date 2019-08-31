
let cb;
const result = require('./result');

try {
  const getConstant = require('./constant')();
  const mongoose= require('mongoose');
  // const callback = function (err, data) {
  //   console.log('callback called+++++++++++++++++++++++++++++++++');
  //   console.log(err, data);
  // };
  //   const event={};
  //   event.body={'_id':'5b56b44a5924da80f761bd0e'};
     // const event = require('../../../mock').driver.event;
  // event.body = require('../../../mock').data.createNotes;
  exports.handler = (event, context, callback) => {

    cb = callback;
    context.callbackWaitsForEmptyEventLoop = false;
      getConstant.then(() => {
      //imports
          const helper= require('./util');
      const db = require('./db').connect();
      const task= require('./model');

      if (helper.checkFromTrigger(cb, event)) return;
       const principals = event.requestContext.authorizer.claims.sub;
       let data=helper.getBodyData(event);
       console.log('data',JSON.stringify(data));
       if (!principals) return;
     let taskId= data._id;
      db.then(()=>{
          console.log('connection established');
          console.log('taskId',taskId);
          return task.findOne({'_id':mongoose.Types.ObjectId(taskId)},{_id:1,driverImages:1,driverSignature:1})
              .then((taskDetils)=>{
                   let taskInfo= (taskDetils)?taskDetils.toObject():''
                  result.sendSuccess(cb,JSON.stringify(taskInfo));
              
              })
      }).catch(sendError)    

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







