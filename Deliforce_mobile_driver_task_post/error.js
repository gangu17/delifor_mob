module.exports = {
    //common
    CODES: {
        SERVER_ERROR: 500,
        AUTH: 403,
        BAD_REQUEST: 400,  // no body or query string if it is mandatory

        //fields
        EMAIL_INVALID: 406,
        PHONE_INVALID: 435,
        PASSWORD_INVALID: 408,
        NAME_INVALID: 409,
        INVALID_INPUT: 405,  // maximum dont use it
        BUSINESS_TYPE_REQUIRED: 412,
        SUCCESS: 200,
        //TRANSACTION
        TRANSACTION_FAILURE: 501 // backend loggig
    },


    //driver
    DRIVER_CODES: {
        TEAM_MANDATORY: 415,
        DUPLICATE_DRIVER_NAME_AND_EMAIL: 420,
        DUPLICTE_EMAIL: 428,
        DUPLICATE_PHONE: 429,
        INVALID_DRIVER: 489,
        BLOCKED_DRIVER: 499
    },

    //task
    TASK_CODES: {
        //fields
        ADDRESS_INVALID: 410,
        ADDRESS_REQUIRED: 438,
        DATE_REQUIRED: 411,
        END_DATE_LESSER_START: 413,
        START_LESSER_THAN_CURRENT: 414,
        PACKAGE_LIMIT_EXID: 480
    },


};
