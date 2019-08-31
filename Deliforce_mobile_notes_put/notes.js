const result = require('./result');
const userModel = require('./model').user;
const notesModel = require('./model').notes;
const  taskLogModel = require('./model').tasklog;
const taskModel = require('./model').tasks;
const helper = require('./util');
const empty = require('is-empty');
const mongoose = require('mongoose');

module.exports = {
    updateNotes: (event, cb, principals) => {
        const clientId = principals;
        console.log(JSON.stringify(event));
        if (!clientId) {
            result.sendUnAuth(cb);
        }
        const data = helper.getBodyData(event);
      //   const data = {
      //       "notes": "hhhh hello abdulllllllllllllllllllllllllllllllll",
      //       "_id": "5bee988f02f47b88afa34b8e",
      //       "taskId":"5bee886efe89d60efcff63e7"
      //   }
        if (!data) {
            result.invalidInput(cb);
        }
        if (empty(data.notes) || empty(data.taskId)) {
            result.invalidInput(cb);
            return;
        }
        Object.assign(data, {driverCognitoSub: clientId});

        const id = mongoose.Types.ObjectId(data['_id']);
        delete data['_id'];
        notesModel.update({_id: id}, data).then((notesData) => {
            userModel.findOne({cognitoSub: clientId}).then((driverDetails) => {
                console.log(driverDetails);
                var driverDetails = driverDetails.toObject();
                taskModel.findOne({_id: mongoose.Types.ObjectId(data.taskId)}).then((taskData) => {
                     console.log('taskData',taskData);
                    userModel.findOne({cognitoSub: driverDetails.clientId}).then((adminDetails) => {
                         console.log('adminDetails',adminDetails);
                        addTaskLogCollection(taskData, driverDetails,adminDetails,data).then(()=>{
                            result.sendSuccess(cb,notesData);
                        });
                    });
                });
            });
        }).catch((err)=> {
            console.log(err);
        });
    }
};


function addTaskLogCollection(taskDetails,driverDetails,adminDetails, data){
    const taskDetail = taskDetails.toObject();
    const adminDetail = adminDetails.toObject();
  
    let obj={
        notes: data.notes,
        role:taskDetail.userRole,
        taskId:taskDetail._id,
        clientId:taskDetail.clientId,
        driverName:driverDetails.name,
        user:adminDetail.name
    };
    const newTaskLog= new taskLogModel(obj);
    return newTaskLog.save();
}





