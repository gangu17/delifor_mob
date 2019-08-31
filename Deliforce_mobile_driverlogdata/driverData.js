const result = require('./result');
const helpModel = require('./model');
const helper = require('./util');
const constant = require('./constant')();
const isIt = constant.isIt;
const empty = require('is-empty');

module.exports = {
    addDriverlog:(event, cb, principals) => {
      //  const clientId = principals['clientId'];
        const clientId = 'ec1a78ef-d7bb-4ff1-901a-4ff191cbed47'
        if (!clientId) {
            result.sendUnAuth(cb);
        }
        const data = helper.getBodyData(event);
        if (!data) {
            result.invalidInput(cb);
        }
        Object.assign(data,{driverCognitoSub:clientId});

        const model = new helpModel(data);
        console.log(data ,model);
        model.save(function (err, data) {
            console.log(err, data);
            if (err) {
                handlerError(err,cb);
            } else {
                result.sendSuccess(cb ,data);
            }
        });
    }
};


function handlerError(error, cb) {
    const err = error.errors;
    if (err.name) {
        result.invalidName(cb);
    }
    else if (err.phone) {
        result.invalidPhone(cb);
    }
    else if (err.message) {
        result.invalidMessage(cb);
    }
    else if (err.enquiryType) {
        result.invalidEnquiryType(cb);
    }
    else {
        result.sendServerError(cb);
    }
}





