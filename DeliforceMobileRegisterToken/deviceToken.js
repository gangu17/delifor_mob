const constant = require('./constant')();
const driverStatus = constant.DRIVER_STATUS;
const result = require('./result');
const driverModel = require('./model').driver;
const helper = require('./util');
const registerToken = require('./registerToken');



/*
Function: createDeviceToken
Input   : event ( data related ) , callback function , pricipals(authentocation data)
output  : Device token is created / relevant error messasge  is sent back
author  : Punith (18-7-2018)(updated)
*/
module.exports = {
    createDeviceToken: (event, cb, principals) => {
        var changeDriverStatus;
        const data = helper.getBodyData(event); // event is parsed and formatted data is sent back.
        if (!data) // If no data
        {
            result.invalidInput(cb); // predefined msg is present in result file.
        } else {
            const clientId = principals; // client id is taken from principals object(Basically driver is identified using client id)
            console.log('clientId', clientId);

            driverModel.findOne({cognitoSub: clientId}).then((driverRes) => {
                if (driverRes.driverStatus === driverStatus.BLOCKED) {
                    result.sendBlocked(cb);
                } else {
                    if (data.deviceToken === null) // If there is no device token in data object.
                    {
                        result.emptyToken(cb); // Predefined msg in result file.
                    }

                    const deviceToken = data.deviceToken;
                    const deviceType = (data.deviceType) ? data.deviceType : '';
                    const iosEndArn = (data.existingARN) ? data.existingARN : '';
                    console.log('deviceToken', deviceToken);
                    // device token

                    // update the location of driver
                    const location = {
                        type: "Point",
                        coordinates: [Number(data.location.lng), Number(data.location.lat)]
                    };
                    (driverRes.driverStatus === driverStatus.IN_TRANSIT) ? changeDriverStatus = driverStatus.IN_TRANSIT : changeDriverStatus = driverStatus.IDLE;
                    //  Driver model update query
                    //  If there is no device token , the token will be generated
                    //  If there is a token , new token will be updated.
                    var finalQuery = formQuery(deviceToken, location, data, changeDriverStatus);
                    driverModel.findOneAndUpdate({cognitoSub: clientId}, {
                        $set: finalQuery
                    }, {new: true}).then((data) => {
                        console.log('mobile info', data);
                        registerToken.subscribeToken(cb, data, deviceType, iosEndArn);
                    }).catch((error) => {
                        console.log('err', error);
                        handlerError(error, cb);
                    });
                }

            }).catch((error) => {
                console.log('err', error);
                handlerError(error, cb);
            });
        }
    },


};


function formQuery(deviceToken, location, data, changeDriverStatus) {
    var query = {
        deviceToken: deviceToken,
        driverStatus: changeDriverStatus,
        batteryState: data.batteryState,
        deviceName: data.deviceName,
        appVersion: data.appVersion
    };

    if (data.location && data.location.formattedAddress) {
        query.currentAddress = data.location.formattedAddress;
    }
    if (data.location.lat && data.location.lng) {
        query.location = location;
    }

    return query;

}


function handlerError(error, cb) {
    console.log(error);
    const err = error.errors;
    if (err.password) {
        result.invalidPassword(cb);
    }
    else {
        result.sendServerError(cb);
    }
}






