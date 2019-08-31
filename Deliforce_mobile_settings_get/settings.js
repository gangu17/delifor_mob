const result = require('./result');
const driverModel = require('./model');


module.exports = {
    fetchSetting: (event, cb, principals, deviceToken) => {
        const clientId = principals;
        console.log('the data is consoled here toooo!!!!' + clientId);
        driverModel.findOne({cognitoSub: clientId}, function (err, driverDetails) {
            var driver = (driverDetails.toObject()) ? driverDetails.toObject() : driverDetails;
            if (deviceToken && driver.deviceToken && deviceToken !== driver.deviceToken) {
                result.duplicateLogin(cb);
            } else {
                console.log('the data is consoled here!!!!', err, driver['settings']);
                if (err) {
                    result.sendServerError(cb);
                } else {
                    result.sendSuccess(cb, {_id: driver._id, settings: driver.settings});
                }

            }
        });
    }
};








