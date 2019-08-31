let cb;
const result = require('./result');

try {
    const getConstant = require('./constant')();
    // const callback = function (err, data) {
    //     console.log('callback called+++++++++++++++++++++++++++++++++');
    //     console.log(err, data);
    // };
    // const event = require('../../../mock').admin.event;
    // event.body = require('../../../mock').admin.event.body;
    exports.handler = (event, context, callback) => {

        cb = callback;
        context.callbackWaitsForEmptyEventLoop = false;

        getConstant.then(() => {
            //imports
            const db = require('./db').connect();
            const barcode = require('./barcode');
            const helper = require('./util');

            if (helper.checkFromTrigger(cb, event)) return;

            const principals = event.requestContext.authorizer.claims.sub;
            if (!principals) return;
            // const principals = '4001aaaf-4b32-49a9-aa61-c6180c8ab22d';

            //connect to db
            db.then(() => barcode.createBarcode(event, cb, principals)).catch(sendError);

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







