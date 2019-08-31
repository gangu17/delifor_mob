module.exports = {
    //common
    CODES: {
        SERVER_ERROR: 500,
        AUTH: 403,
        BAD_REQUEST: 400,  // no body or query string if it is mandatory

        //fields
        EMAIL_INVALID: 406,
        PHONE_INVALID: 407,
        PASSWORD_INVALID: 408,
        NAME_INVALID: 409,
        INVALID_INPUT: 405,  // maximum dont use it
        BUSINESS_TYPE_REQUIRED: 412,
        SUCCESS: 200,
        DUPLICTE_EMAIL: 428,
        DUPLICATE_PHONE: 429,
        //TRANSACTION
        TRANSACTION_FAILURE: 501 // backend loggig
    },

    //driver
    DRIVER_CODES: {
        DUPLICATE_LOGIN: 494,
        DEVICETOKEN_NOT_FOUND: 493
    },

};
