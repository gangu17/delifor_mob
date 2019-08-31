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
        console.log(JSON.stringify(event));

        cb = callback;
        context.callbackWaitsForEmptyEventLoop = false;

        getConstant.then(() => {
            //imports
            const db = require('./db').connect();
            const taskcompletion = require('./taskCompletion');
            const helper = require('./util');

            if (helper.checkFromTrigger(cb, event)) return;

            const deviceToken = helper.getDeviceToken(cb, event);
            const principals = event.requestContext.authorizer.claims.sub;
            //connect to db

            if (!principals) return;


            db.then(() => taskcompletion.taskComplete(event, cb, principals, deviceToken)).catch(sendError);

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







