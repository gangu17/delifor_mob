const result = require('./result');
const driver = require('./model');
const helper = require('./util');
const mongoose = require('mongoose');

module.exports = {
    updateDriverSetting: (event, cb, principals, deviceToken) => {
        console.log('event', JSON.stringify(event));
        const data = helper.getBodyData(event);
        console.log(data);
        if (!data.settings) {
            result.invalidInput(cb);
        } else {
            data.settings.showTraffic = false;
            console.log(data.settings);
            if (Object.keys(data.settings).length >= 10) {
                const clientId = principals;
                return fetchDriverDetails(clientId).then((driverDetails) => {
                    var drivers = (driverDetails.toObject()) ? driverDetails.toObject() : driverDetails;
                    if (deviceToken && drivers.deviceToken && deviceToken !== drivers.deviceToken) {
                        result.duplicateLogin(cb);
                    } else {
                        driver.update({cognitoSub: clientId}, {$set: {settings: data.settings}}).then((resp) => {
                            console.log(resp);
                            result.sendSuccess(cb, {message: 'settings are updated successfully'});
                        }).catch((error) => {
                            result.sendServerError(cb)
                        });
                    }
                }).catch((error) => {
                    result.sendServerError(cb)
                });
            } else {
                result.sendSuccess(cb, {'msg': 'params is missing'})
            }
        }
    }
};


function fetchDriverDetails(clientId) {
    return driver.findOne({cognitoSub: clientId});
}


