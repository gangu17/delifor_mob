const result = require('./result');
const settingModel = require('./model');
const helper = require('./util');

module.exports = {
  fetchSetting:(event, cb, principals) => {
    const clientId = (helper.isAdmin(principals)) ? principals['sub'] : principals['clientId'];
    settingModel.find({clientId: clientId, isCurrent: true}, {
      acknowledgementType: 1,
      actionBlock: 1,
      businessType: 1,
      autoAllocation: 1,
      notifications: 1
    }, function (err, settings) {
      console.log(err, settings);
      if (err) {
        result.sendServerError(cb);
      } else {
      result.sendSuccess(settings[0]);
      }
    });
  }
};








