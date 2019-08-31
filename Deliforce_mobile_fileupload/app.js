const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const app = express();



app.use(compression());
app.use(cors());
app.use(bodyParser.json({"limit":900000}));
app.use(bodyParser.urlencoded({"limit":900000,"extended": true,"parameterLimit": 900000}));
app.use(awsServerlessExpressMiddleware.eventContext());

console.log('in apps');

module.exports = {
  app : app
};

