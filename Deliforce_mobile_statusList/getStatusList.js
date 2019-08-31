const result = require('./result');
const helper = require('./util');
const statusListModel = require('./model');
const mongoose = require('mongoose');
module.exports = {
    statusList: (event, cb) => {
        const data = helper.getQueryData(event);
        console.log('data :', JSON.stringify(data));
        if (!data) {
            result.invalidInput(cb);
            return;
        }

        statusListModel.findOne({language: data.language}).then((statusList) => {
            console.log(statusList);
            result.sendSuccess(cb, statusList);
        });
    }
};