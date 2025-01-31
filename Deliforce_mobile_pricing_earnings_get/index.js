let cb;
const result = require('./result');


try {
    const getConstant = require('./constant')();
    /* const callback = function (err, data) {
         console.log('callback called+++++++++++++++++++++++++++++++++');
         console.log(err, data);
     };*/

    exports.handler = (event, context, callback) => {
        console.log(JSON.stringify(event));
        cb = callback;
        context.callbackWaitsForEmptyEventLoop = false;

        getConstant.then(() => {
            //imports
            const db = require('./db').connect();
            const list = require('./earningsList');
            const helper = require('./util');

            if (helper.checkFromTrigger(cb, event)) return;


            /*
            principals explanation: for admin sub is clientId for manager clientId is clientId
            {  sub: 'current user cognitosub',
            role: 'role id of user',
            clientId:'exist if user is manager & this is clientid of that manager',
            teams: 'team Assigned to manager' }
            */
            const deviceToken = helper.getDeviceToken(cb, event);
            const principals = event.requestContext.authorizer.claims.sub;
            // const principals="6cada284-4624-4bcc-815c-d49793e2a0c9";
            if (!principals) return;

            //connect to db
            db.then(() => list.eaningsList(event, cb, principals, deviceToken)).catch(sendError);

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







