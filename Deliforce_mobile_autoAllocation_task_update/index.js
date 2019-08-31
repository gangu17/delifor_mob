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
    exports.handler = (event, context, callback) => { // after testing uncomment the code
        console.log('Event', JSON.stringify(event));
        cb = callback;
        context.callbackWaitsForEmptyEventLoop = false; // after testing uncomment the code

        getConstant.then(() => {
            //imports
            const db = require('./db').connect();
            const task = require('./taskUpdate');
            const helper = require('./util');

            if (helper.checkFromTrigger(cb, event)) return; //after testing uncomment the code

            const principals = event.requestContext.authorizer.claims.sub; //after testing uncomment the code
            // const principals = "10d378e8-2e51-4661-ad5b-c5ce0eb990ab";
            if (!principals) return;

            //connect to db
            db.then(() => task.taskUpdate(event, cb, principals)).catch(sendError);

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

