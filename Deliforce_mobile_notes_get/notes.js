const result = require('./result');
const notesModel = require('./model');
const helper = require('./util');
const constant = require('./constant')();
const isIt = constant.isIt;
const mongoose = require('mongoose');
const moment = require('moment-timezone');



module.exports = {
    getNotes:(event, cb, principals) => {

        console.log(event);
        const clientId =  principals;
        const data = helper.getBodyData(event);
        //    const data = {'taskId':"5b7ba2297526b1363b7bb10d"}
        console.log('data',JSON.stringify(event),clientId);
        const taskId = String(data.taskId);
        console.log(taskId);

        notesModel.find({taskId:mongoose.Types.ObjectId(taskId), isDeleted:isIt.NO},
            function (err, data) {
                console.log(data);
                if (err) {
                    result.sendServerError(cb);
                } else {
                    let newData= [];
                    console.log("result section");
                    if (data.length) {
                        newData=data.map((res) => {
                            let t=res.toObject();
                            console.log('t',JSON.stringify(t.created_at));
                            let stDate=new Date(t.created_at);
                            let tz= (t.timezone)?t.timezone :'Asia/Calcutta';
                            console.log('timezone',stDate);
                            let m = moment.utc(stDate, "YYYY-MM-DD h:mm:ss A");
                            t.created_at=m.tz(tz).format("YYYY-MM-DD h:mm:ss A");
                            return t;

                        });
                        newData.reverse();

                    }
                    console.log('final Data',JSON.stringify(newData));
                    result.sendSuccess(cb,JSON.stringify({'notesList':newData}));

                }
            });
    }
};








