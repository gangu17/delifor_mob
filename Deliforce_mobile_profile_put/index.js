let cb;
const result = require('./result');

try {
    const getConstant = require('./constant')();
    // const callback = function (err, data) {
    //   console.log('callback called+++++++++++++++++++++++++++++++++');
    //   console.log(err, data);
    // };
    // const event = require('../../../mock').driver.event;
    //event.body = require('../../../mock').data.getProfile;
    exports.handler = (event, context, callback) => {

        cb = callback;
        context.callbackWaitsForEmptyEventLoop = false;

        getConstant.then(() => {
            //imports
            const db = require('./db').connect();
            const profile = require('./profile');
            const helper = require('./util');

            if (helper.checkFromTrigger(cb, event)) return;
            const deviceToken = helper.getDeviceToken(cb, event);
            console.log('event', JSON.stringify(event));
            let principals = event.requestContext.authorizer.claims.sub;
            if (!principals) return;
            console.log(JSON.stringify(principals));
            //connect to db
            db.then(() => profile.checkDuplicate(event, cb, principals, deviceToken)).catch(sendError);

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







