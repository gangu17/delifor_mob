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
            let AWS = require('aws-sdk');
            const endPointConstant = res.ENDPOINT_ARN;
            let iotdata = new AWS.IotData({endpoint: endPointConstant.ENDPOINT_ARNKEY});
            let resultData = [];
            if (data.adminArray.length > 0) {
                for (let i = 0; i < data.adminArray.length; i++) {
                    let params = {
                        topic: '/' + 'task' + '/' + data.adminArray[i],
                        payload: JSON.stringify({
                            'taskId': data._id,
                            'taskStatus': data.taskStatus,
                            'location_lat': data.location_lat,
                            'location_lng': data.location_lan,
                            'driverName': data.driverName,
                            'imgUrl': data.imgUrl
                        }),
                        qos: 1
                    };
                    console.log(params);
                    console.log('Adminarray', data.adminArray[i]);
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
        }).catch((err) => {
            console.log(err);
            result.sendServerError(cb);
        });
    };

} catch (err) {
    console.error('error +++', err);
    result.sendServerError(cb);
}







