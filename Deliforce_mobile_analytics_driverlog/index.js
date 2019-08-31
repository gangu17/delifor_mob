let cb;
const result = require('./result');

try {
    const getConstant = require('./constant')();
    // const callback = function (err, data) {
    //     console.log('callback called+++++++++++++++++++++++++++++++++');
    //     console.log(err, data);
    // };
    // const event = require('../mock').admin.event;
    // event.body = require('../mock').admin.event.body;
    exports.handler = (event, context, callback) => {
        console.log('event', JSON.stringify(event));
        cb = callback;
        context.callbackWaitsForEmptyEventLoop = false;

        getConstant.then(() => {
            //imports
            const db = require('./db').connect();
            const driverlog = require('./driverlog');
            const helper = require('./util');

            if (helper.checkFromTrigger(cb, event)) return;

            /*
            principals explanation: for admin sub is clientId for manager clientId is clientId
            {  sub: 'current user cognitosub',
            role: 'role id of user',
            clientId:'exist if user is manager & this is clientid of that manager',
            teams: 'team Assigned to manager' }
            */
            //    const principals = "e4847be4-916e-4911-8a14-a0005e6f3126";
            const deviceToken = helper.getDeviceToken(cb, event);
            const principals = event.requestContext.authorizer.claims.sub;
            if (!principals) return;
            console.log(JSON.stringify(principals));


            //connect to db
            db.then(() => driverlog.ontime(event, cb, principals, deviceToken)).catch(sendError);

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







