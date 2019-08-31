let cb;
const result = require('./result');

// function callback(err, data) {
//     console.log(err, data);
//
// }
//
// const event = require('../mock').admin.event;
// event.body = require('../mock').admin.event.body;

try {
    const getConstant = require('./constant')();
    exports.handler = (event, context, callback) => {
        console.log('Event', JSON.stringify(event));
        cb = callback;
        context.callbackWaitsForEmptyEventLoop = false;

        getConstant.then(() => {
            //imports
            const db = require('./db').connect();
            const hours = require('./hours');
            const helper = require('./util');

            const userModel = require('./model').user;

            if (helper.checkFromTrigger(cb, event)) return;
            const deviceToken = helper.getDeviceToken(cb, event);
            const principals = event.requestContext.authorizer.claims.sub;

            //const principals='ec1a78ef-d7bb-4ff1-901a-4ff191cbed47'
            if (!principals) return;


            //connect to db
            db.then(() => {
                //return userModel.findOne({cognitoSub:principals}).then((driverInfo)=>{
                // driverInfo= driverInfo.toObject();
                hours.ontime(event, cb, principals, deviceToken)
            }).catch(sendError);

            function sendError(error) {
                console.error('error +++', error);
                result.sendServerError(cb);
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







