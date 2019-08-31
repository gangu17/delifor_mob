const result = require('./result');
const helper = require('./util');
const constant = require('./constant')();
const isIt = constant.isIt;
const role = constant.ROLE;
const model = require('./model').userModel;


module.exports = {
    //princial  manager- clientId , role , sub , teams
    //admin - sub , role
    changePassword: (event, cb) => {
        const data = helper.getBodyData(event);
        if (!data) {
            result.invalidInput(cb);
        } else {
            return model.findOneAndUpdate({
                'isDeleted': isIt.NO,
                'phone': data['phone'],
                'role': role.DRIVER
            }, {'password': data['newPassword']},{new: true})
                .then((response) => {
                    console.log('response', response);
                    (response)? result.sendSuccess(cb, {'msg': 'password changed succesfully'}): result.invalidClient(cb);
                }).catch(() => {
                    result.invalidClient(cb);
                });
        }
    }
};





