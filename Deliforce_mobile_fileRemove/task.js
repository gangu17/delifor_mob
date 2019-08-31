const taskModel= require('./model').taskModel;
const taskLogModel = require('./model').tasklogModel;
const mongoose= require('mongoose');
const result = require('./result');
module.exports= {
    updateTasks:updateTaskModel
};

function updateTaskModel(taskId,imageUrl,cb){
    console.log('taskId',taskId);
    console.log('imageUrl',imageUrl);
    taskModel.update({_id:mongoose.Types.ObjectId(taskId)},{ $pull: { driverImages: imageUrl }})
        .then((data)=>{
         if(data.nModified===1){
             console.log('coming here');
             taskLogModel.aggregate(
                 [{ $match : { 'imageArry' :
                             { $in :
                                     [imageUrl]
                             },
                         "taskId":taskId }
                 }]
             ).then((taskLogdata)=> {
                     console.log(JSON.stringify(taskLogdata) + 'hiiiiiiiiiiiiiiiiiiiiiiiiiiiii tasklogdata');
                 taskLogModel.update({_id:mongoose.Types.ObjectId(taskLogdata[0]._id)},{ $pull: { imageArry: imageUrl }}).then((taskLog)=> {
                     console.log(JSON.stringify(taskLog) + 'updated tasklogdata');
                     if(taskLog.nModified===1) {
                         result.sendSuccess(cb, JSON.stringify({
                             status: 200,
                             'message': 'Image removed in task colletion succeessfully'
                         }));
                     }
                 }).catch((err)=> {
                     result.sendSuccess(cb,JSON.stringify({status:200,'message':'Image not removed in taskColletion succeessfully'}));
                 })
             });

         }
         else{
             result.sendSuccess(cb,JSON.stringify({status:200,'message':'Image not removed in taskColletion succeessfully'}));
         }
        })
        .catch((error)=>{
          console.log('error',error);
          result.sendServerError(cb);
        })
}
