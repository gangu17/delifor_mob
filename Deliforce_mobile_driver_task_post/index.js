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

        cb = callback;
        console.log('Event:', JSON.stringify(event));
        context.callbackWaitsForEmptyEventLoop = false;

        getConstant.then(() => {
            //imports
            const db = require('./db').connect();
            const task = require('./task');
            const helper = require('./util');
            const userModel = require('./model').userModel;
            const userPlanModel = require('./model').userPlansModel;

            const principals = event.requestContext.authorizer.claims.sub;
            if (!principals) return;
            console.log('principals+++', principals);

            let data = helper.getBodyData(event);

            if (!data) {
                result.invalidInput(cb);
            } else {
                userModel.findOne({cognitoSub: principals}).then((driverInfo) => {
                    driverInfo = driverInfo.toObject();
                    userPlanModel.findOne({clientId: driverInfo.clientId}).then((plan) => {
                        let plans = plan.toObject();
                        if ((plans.planType === 1 && plans.taskCount < plans.taskLimit) || (plans.planType === 2)) {
                            return db
                                .then(() => task.saveTask(event, cb, principals, plans))
                                .catch((err) => {
                                    console.error('error +++', error);
                                    result.sendServerError(cb);
                                });
                        } else {
                            result.PackageLimt(cb);
                        }
                    });
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