let cb;
const result = require('./result');
const helper = require('./util');
try {
    const getConstant = require('./constant')();
    exports.handler = (event, context, callback) => {
        console.log('Event', JSON.stringify(event));
        const data = helper.getBodyData(event);
        cb = callback;
        context.callbackWaitsForEmptyEventLoop = false;

        getConstant.then((res) => {
            var AWS = require('aws-sdk');
            const endPointConstant = res.ENDPOINT_ARN;
            var iotdata = new AWS.IotData({endpoint: endPointConstant.ENDPOINT_ARNKEY});
            var resultData = [];
            var finalparams = getParams(data);
            if (data.adminArray.length > 0) {
                for (let i = 0; i < data.adminArray.length; i++) {
                    params = {
                        topic: '/' + data.topic + '/' + data.adminArray[i],
                        payload: JSON.stringify(finalparams),
                        qos: 1,

                    };
                    console.log(params);
                    console.log('Adminarray', data.adminArray[i]);
                    /*iotdata.publish(params, function (err, data) {
                       if (err) {
                           console.log(err);
                           result.notPublished(cb);
                       }
                       else {
                           console.log("mqtt success", JSON.stringify(data));
                           resultData.push('success');
                       }
                   });*/
                    resultData.push(iotPub(params));
                }

                Promise.all(resultData);
            }

            function iotPub(params) {
                iotdata.publish(params, function (err, data) {
                    if (err) {
                        console.log(err);
                        result.notPublished(cb);
                    }
                    else {
                        console.log("mqtt success", JSON.stringify(data));
                    }
                });
            }

            function getParams(data) {
                var query = {
                    'driverId': data.driverId,
                    'driverStatus': data.status
                };
                if (data.formattedAddress) {
                    query.currentAddress = data.formattedAddress;
                }

                if (data.location_lat && data.location_lng) {
                    query.location_lat = data.location_lat;
                    query.location_lng = data.location_lng;
                }

                return query;
            }
        }).catch((err) => {
            console.log(err);
            result.sendServerError(cb);
        });
    };

} catch (err) {
    console.error('error +++', err);
    result.sendServerError(cb);
}







