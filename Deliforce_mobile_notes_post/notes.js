const result = require('./result');
const userModel = require('./model').user;
const notesModel = require('./model').notes;
const  taskLogModel = require('./model').tasklog;
const taskModel = require('./model').tasks;
const helper = require('./util');
const empty = require('is-empty');
const mongoose = require('mongoose');

module.exports = {
    createNotes: (event, cb, principals) => {
        const clientId = principals;
        console.log(JSON.stringify(event));
        if (!clientId) {
            result.sendUnAuth(cb);
        }
        const data = helper.getBodyData(event);
        if (!data) {
            result.invalidInput(cb);
        }
        if (empty(data.notes) || empty(data.taskId)) {
            result.invalidInput(cb);
            return;
        }
        Object.assign(data, {driverCognitoSub: clientId});
        const model = new notesModel(data);
        model.save().then((notesData) => {
            userModel.findOne({cognitoSub: clientId}).then((driverDetails) => {
                 var driverDetail = driverDetails.toObject();
                taskModel.findOne({_id: mongoose.Types.ObjectId(data.taskId)}).then((taskData) => {
                    var taskDetail = taskData.toObject();
                    userModel.findOne({cognitoSub: driverDetail.clientId}).then((adminDetails) => {
                         var adminDetail = adminDetails.toObject();
                
                    
                        addTaskLogCollection(taskDetail, driverDetail,adminDetail,data).then(()=>{
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
    console.log('driverDetails1',driverDetails);
    console.log('driverDetails2',driverDetails);
    let obj={
        notes: data.notes,
        role:taskDetails.userRole,
        taskId:taskDetails._id,
        clientId:taskDetails.clientId,
        driverName:driverDetails.name,
        user:adminDetails.name
    };
    const newTaskLog= new taskLogModel(obj);
    return newTaskLog.save();
}





