const result = require('./result');
const helper = require('./util');
const driverModel = require('./model');
const cognito = require('./cognito');
const constant = require('./constant')();
const isIt = constant.isIt;
const _ = require('lodash');

module.exports = {
    checkDuplicate: (event, cb, principals, deviceToken) => {
        const data = helper.getBodyData(event);
        if (!data) {
            result.invalidInput(cb);
        } else {
            const clientId = principals;
            console.log(data);
            console.log(data.phone);
            var formQuery = basicQuery(data, clientId);
            driverModel.aggregate(formQuery, (err, driver) => {
                if (err) {
                    result.sendServerError(cb);
                } else if (driver.length) {
                    console.log(driver);
                    console.log('Duplicate driver Exist');
                    if (driver[0].email === data.email) {
                        console.log('duplicate key of email');
                        result.sendDuplicateEmail(cb, JSON.stringify({message: 'email alerady Exist'}));
                    } else {
                        console.log('duplicate key of phone');
                        result.sendDuplicatePhone(cb, JSON.stringify({message: 'Phone Number alerady Exist'}));
                    }
                }
                else {
                    console.log('update driver');

                    if (!_.isEmpty(data) && data.phone) {
                        console.log('data exist');
                        console.log(validateDriverData(data.phone));
                        let flag = validateDriverData(data.phone);
                        if (flag) {
                            console.log('validation true');
                            cognitoDriver(data, cb, clientId, deviceToken);
                        } else {
                            console.log('phone validation failed');
                            result.sendServerError(cb);
                        }
                    }
                    else {
                        result.sendServerError(cb);
                    }

                }
            });
        }
    }
};


function validateDriverData(d) {
    console.log('validateDriverFunction');
    const regex = /^\d+$/;
    const split = d.substring(1).split(' ');
    if (d.charAt(0) !== '+') {
        return false;
    } else if (split.length === 2) {
        var arr = split.filter((s) => !regex.test(s));
        return (!arr.length);
    } else {
        return false;
    }
}


function basicQuery(data, clientId) {
    var defaultQuery = [
        {
            '$match': {
                '$or': [
                    {'phone': data.phone}
                ],
                'isDeleted': isIt.NO,
                'cognitoSub': {$ne: clientId}
            }
        }
    ];

    if (data.email) {
        defaultQuery[0].$match.$or.push({'email': data.email});
    }
    return defaultQuery;

}


function findCognitoDiff(a, b) {
    const result = {};

    if (a['phone'] !== b['phone']) {
        result['phone'] = b['phone'];
    }
    if (a['name'] !== b['name']) {
        result['name'] = b['name'];
    }
    if (a['email'] !== b['email']) {
        result['email'] = b['email'];
    }
    return result;
}

function cognitoDriver(data, cb, driverCognitoSub, deviceToken) {
    console.log('cognitoDriver function');
    driverModel.findOne({cognitoSub: driverCognitoSub}, (err, driverData) => {
        if (err) {
            result.sendServerError(cb);
        } else {
            //NOTE : password cannot be changed by admin.
            const filterData = data;

            console.log(JSON.stringify(driverData));
            driverData = (driverData.toObject()) ? driverData.toObject() : driverData;
            if (deviceToken && driverData.deviceToken && deviceToken !== driverData.deviceToken) {
                result.duplicateLogin(cb);
            } else {
                let email = driverData.phone.replace(' ', '');
                console.log('email', email);
                const diff = findCognitoDiff(driverData, data);
                if (_.isEmpty(diff)) {
                    upsertDriver(filterData, cb, driverCognitoSub);
                } else {
                    console.log(diff);
                    console.log(email);
                    updateCognito(diff, filterData, email, driverCognitoSub);
                }
            }
        }
    });


    function updateCognito(update, data, userName, driverCognitoSub) {
        cognito.updateUser(update, userName).then(() => {
            console.log('cognito updated successfully');
            upsertDriver(data, cb, driverCognitoSub);
        }).catch((err) => {
            console.log(err);
            sendCognitoError(err, cb)
        });
    }
}


function upsertDriver(data, cb, driverId) {
    console.log(JSON.stringify(data));
    console.log(data.phone);
    driverModel.update({cognitoSub: driverId}, data, function (error, data) {
        if (error) {
            console.log(error);
            handlerError(error, cb);
        } else {
            result.sendSuccess(cb, JSON.stringify({httpCode: 200, 'message': 'Driver profile updates successfully'}));
        }
    });
}

function handlerError(error, cb) {

    const err = error.errors;

    if (!err) {
        result.sendServerError(cb);
    } else {
        if (err.email) {
            result.invalidEmail(cb);
        }
        else if (err.name) {
            result.invalidName(cb);
        }
        else if (err.phone) {
            result.invalidPhone(cb);
        }
        else {
            console.log(err);
            result.invalidInput(cb);
        }
    }
}

function sendCognitoError(err, cb) {
    console.log('cognito error', err);
    const cognito = constant.COGNITO_ERROR;
    if (err.code === cognito.PASSWORD_INVALID) {
        result.invalidPassword(cb);
    } else if (err.code === cognito.EMAIL_EXIST) {
        result.sendDuplicatePhone(cb);
    } else if (err.code === cognito.INVALID_DATA) {
        console.log('invalid phone or email');
        result.invalidPhone(cb);
    } else {
        result.invalidInput(cb);
    }
}


//princial  manager- clientId , role , sub , teams
//admin - sub , role




