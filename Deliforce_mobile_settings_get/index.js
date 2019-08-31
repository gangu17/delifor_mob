let cb;
const result = require('./result');

try {
    const getConstant = require('./constant')();

    exports.handler = (event, context, callback) => {

        cb = callback;
        context.callbackWaitsForEmptyEventLoop = false;

        getConstant.then(() => {
            //imports
            const db = require('./db').connect();
            const settings = require('./settings');
            const helper = require('./util');

            if (helper.checkFromTrigger(cb, event)) return;
            const deviceToken = helper.getDeviceToken(cb, event);
            const principals = event.requestContext.authorizer.claims.sub;
            if (!principals) return;
            console.log(JSON.stringify(principals));


            //connect to db
            db.then(() => settings.fetchSetting(event, cb, principals, deviceToken)).catch(sendError);

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





