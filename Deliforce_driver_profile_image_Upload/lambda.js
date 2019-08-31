// lambda.js
'use strict';
const getConstant = require('./constant')();

exports.handler = (event, context) =>{
    getConstant.then((res) => {
        console.log('res in lambda', res);
        const awsServerlessExpress = require('aws-serverless-express');
        const app = require('./index');
        const server = awsServerlessExpress.createServer(app);
        awsServerlessExpress.proxy(server, event, context);
    });
};
