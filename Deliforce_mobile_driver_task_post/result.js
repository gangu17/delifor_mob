const common = require('./error').CODES;
const task = require('./error').TASK_CODES;
const driver = require('./error').DRIVER_CODES;

module.exports = {

    sendServerError: (cb) => {
        cb(null, formResponse(common.SERVER_ERROR, {}));
    },

    sendSuccess: (cb, body) => {
        cb(null, formResponse(common.SUCCESS, body));
    },


    businessMissing: (cb) => {
        cb(null, formResponse(common.BUSINESS_TYPE_REQUIRED, {}));
    },

    sendResult: (statusCode, body, cb) => {
        cb(null, statusCode, body);
    },

    sendUnAuth: (cb) => {
        cb(null, formResponse(common.AUTH, {message: 'Unauthorized'}));
    },

    fromTrigger: (cb) => {
        console.log('fromTrigger');
        cb(null, formResponse(400, ''));
    },

    invalidInput: (cb) => {
        cb(null, formResponse(common.BAD_REQUEST, ''));
    },


    //app


    invalidName: (cb) => {
        cb(null, formResponse(common.NAME_INVALID, {message: 'invalid name'}));
    },

    invalidDriver: (cb) => {
        cb(null, formResponse(driver.INVALID_DRIVER, {message: 'invalid driver'}));
    },

    blockedDriver: (cb) => {
        cb(null, formResponse(driver.BLOCKED_DRIVER, {message: 'Driver has been blocked by admin'}));
    },

    invalidEmail: (cb) => {
        cb(null, formResponse(common.EMAIL_INVALID, {message: 'invalid email'}));
    },

    invalidAddress: (cb) => {
        cb(null, formResponse(task.ADDRESS_INVALID, {message: 'invalid address'}));
    },

    invalidPhone: (cb) => {
        cb(null, formResponse(common.PHONE_INVALID, {message: 'invalid phone'}));
    },


    addressRequired: (cb) => {
        cb(null, formResponse(task.ADDRESS_REQUIRED, {message: 'address required'}));
    },


    invalidDate: (cb) => {
        cb(null, formResponse(task.DATE_REQUIRED, {message: 'invalid date'}));
    },

    lesserThanCurrentDate: (cb) => {
        cb(null, formResponse(task.START_LESSER_THAN_CURRENT, {message: ''}));
    },
    PackageLimt: (cb) => {
        cb(null, formResponse(task.PACKAGE_LIMIT_EXID, {message: 'Package Limit exied'}));
    },

    //not applicable for pickup & delivery
    endLesserThanStart: (cb) => {
        cb(null, formResponse(task.END_DATE_LESSER_START, {message: ''}));
    }
};

function formResponse(code, body) {
    const response = {headers: {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'}};
    const result = (typeof body === 'object') ? JSON.stringify(body) : body;
    return Object.assign(response, {statusCode: code, body: result});
}
