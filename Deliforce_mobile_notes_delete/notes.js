const result = require('./result');
const userModel = require('./model').user;
const notesModel = require('./model').notes;
const  taskLogModel = require('./model').tasklog;
const taskModel = require('./model').tasks;
const helper = require('./util');
const mongoose = require('mongoose');

module.exports = {
    deleteNotes: (event, cb, principals) => {
        const clientId = principals;
        console.log(JSON.stringify(event));
        if (!clientId) {
            result.sendUnAuth(cb);
        }
        const data = helper.getBodyData(event);
        // const data = {
        //     "notes": "hhhh hello abdulllllllllllllllllllllllllllllllll",
        //     "_id": "5bee988f02f47b88afa34b8e",
        //     "taskId":"5bee886efe89d60efcff63e7"
        // }
        if (!data) {
            result.invalidInput(cb);
        }
        // if (empty(data.notes) || empty(data.taskId)) {
        //     result.invalidInput(cb);
        //     return;
        // }
        Object.assign(data, {driverCognitoSub: clientId});

        const id = mongoose.Types.ObjectId(data['id']);
        delete data['id'];
           notesModel.findOne({_id:id}).then((notesD) => {
        notesModel.update({_id: id}, {isDeleted: 1}).then((notesData) => {
            userModel.findOne({cognitoSub: clientId}).then((driverDetails) => {
                var driverDetail = driverDetails.toObject();
                taskModel.findOne({_id: mongoose.Types.ObjectId(data.taskId)}).then((taskData) => {
                    var taskDetail = taskData.toObject();
                    userModel.findOne({cognitoSub: driverDetail.clientId}).then((adminDetails) => {
                        var adminDetail = adminDetails.toObject();
                          addTaskLogCollection(taskDetail, driverDetail, adminDetail, notesD).then(() => {
                            result.sendSuccess(cb, notesData);
                        });
                    });
                });
            });
        });
    }).catch((err)=> {
            console.log(err);
        });
    }
};


function addTaskLogCollection(taskDetails,driverDetails,adminDetails, notesD){
     let obj={
        notes: notesD.notes,
        role:taskDetails.userRole,
        taskId:taskDetails._id,
        clientId:taskDetails.clientId,
        driverName:driverDetails.name,
        user:adminDetails.name
    };
    const newTaskLog= new taskLogModel(obj);
    return newTaskLog.save();
}





