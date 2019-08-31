
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
        const notifications = require('./notifications');
        const helper = require('./util');

        if (helper.checkFromTrigger(cb, event)) return;
          const principals = event.requestContext.authorizer.claims.sub;
          if (!principals) return;
        console.log(JSON.stringify(principals));
          db.then(() => notifications.fetchNotifications(event, cb, principals)).catch(sendError);

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







