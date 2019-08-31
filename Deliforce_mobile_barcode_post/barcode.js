const result = require('./result');
const userModel = require('./model').user
const barcodeModel = require('./model').barcode;
const  taskLogModel = require('./model').tasklog;
const taskModel = require('./model').tasks;
const helper = require('./util');
const constant = require('./constant')();
const isIt = constant.isIt;
const empty = require('is-empty');
const mongoose = require('mongoose');



module.exports = {
    createBarcode: (event, cb, principals) => {
        const clientId = principals;
        console.log(JSON.stringify(event));
        if (!clientId) {
            result.sendUnAuth(cb);
        }
      const data = helper.getBodyData(event);
      //  const data = {};
        // data.taskId = '5bed021503192f1ff5448fde'
        // data.barcode = 'hellobarcode'
        if (!data) {
            result.invalidInput(cb);
        }
        if (empty(data.barcode) || empty(data.taskId)) {
            result.invalidInput(cb);
            return;
        }
        Object.assign(data, {driverCognitoSub: clientId})
        barcodeModel.find({taskId:data.taskId,taskStatus:15}).then((bardcodeArray)=> {
            if(bardcodeArray.length) {
                barcodeModel.update({taskId:data.taskId,taskStatus:15}, data)
            } else {
                const model = new barcodeModel(data);
                model.save().then((barcodeData) => {
                    userModel.findOne({cognitoSub: clientId}).then((driverDetails) => {
                        let driverDetail = driverDetails.toObject();
                        taskModel.findOne({_id: mongoose.Types.ObjectId(data.taskId)}).then((taskData) => {
                            let taskDetail = taskData.toObject();
                            userModel.findOne({cognitoSub: driverDetail.clientId}).then((adminDetails) => {
                                let adminDetail = adminDetails.toObject();
                                addTaskLogCollection(taskDetail, driverDetail, adminDetail,data).then(() => {
                                    result.sendSuccess(cb, barcodeData)
                                })
                            })
                        })
                    })
                })
            }
        })
       .catch((err)=> {
            console.log(err);
        })
    }
}


function addTaskLogCollection(taskDetail,driverDetail,adminDetail,data){
    let obj={
        barcode:data.barcode,
        role:taskDetail.userRole,
        taskId:data.taskId,
        clientId:taskDetail.clientId,
        driverName:driverDetail.name,
        user:adminDetail.name
    };
    const newTaskLog= new taskLogModel(obj);
    return newTaskLog.save()
}





