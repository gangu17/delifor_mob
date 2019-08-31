let cb;
const result = require('./result');

try {

    const getConstant = require('./constant')();

    /*const callback = function (err, data) {
        console.log('callback called+++++++++++++++++++++++++++++++++');
        console.log(err, data);
    };

    const event = {  "resource": "/settings/change-password",
        "path": "/settings/change-password",
        "httpMethod": "PUT",
        "headers": {
            "Accept": "application/json, text/plain, *!/!*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
            "Authorization": "eyJraWQiOiJwc0Mwakpxd2V5RCtVM3FYenB2RVZ4SEI3NXdKYUVUcVwvZlNrTitaWExSbz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJlMDhjYWMzOC1lMjEzLTQ0NzQtODdjNi0wMDc2NDUzOWQ2NDkiLCJkZXZpY2Vfa2V5IjoiYXAtc291dGgtMV9kMDljOTk4Ni01ZTAxLTQyYzYtYmQyNC1iNTdhYWI3ZDVjNTQiLCJldmVudF9pZCI6ImU3NmE5MTk1LTNlNzQtMTFlOS1iODIxLTI3YTJhZTE4NDE5ZSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE1NTE3MDA3NDMsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5hcC1zb3V0aC0xLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoLTFfQVFKSnBoRXg0IiwiZXhwIjoxNTUxNzYzMDc2LCJpYXQiOjE1NTE3NTk0NzYsImp0aSI6ImU5NTc5OTNmLTM1YTgtNDBjOS1hNGM3LWY1ZWJlN2MzNjNlZCIsImNsaWVudF9pZCI6IjUzdDBwbm1zMXE2ZmN1MmpocjVuNG9hY3QzIiwidXNlcm5hbWUiOiJlMDhjYWMzOC1lMjEzLTQ0NzQtODdjNi0wMDc2NDUzOWQ2NDkifQ.lwrDZsSOzW-FYu0ZyEFTlzaK9qqzGVf0-Vh2xjUK92urivETS5xtdwTdOlI0KCNrZGQbHe5-x_K2PbQijZRnqC_HxDICb-n6M60oGfY8NUh4ejMqmc6yYaZG2BfRBCoijLO1y-epMxL-2LVxFr8mhErL788-D_jCjHjsk3B3p8QGeCOA_w0oZ1vVtTNbOCpqEWpDgwU-0xQwoFhjTUqR5E9kjvZVO3aU-BSBfnIzbHqbQxoB36goeDffiNUHzPBEjSzHCAlzmO7hfCwy3R_k6z-cqeBjsJ5SfVw8RnhDcObrjNXOhVwDTJVH_X7FemcfXFDsSUlHKNUSAruT1_8zyA",
            "CloudFront-Forwarded-Proto": "https",
            "CloudFront-Is-Desktop-Viewer": "true",
            "CloudFront-Is-Mobile-Viewer": "false",
            "CloudFront-Is-SmartTV-Viewer": "false",
            "CloudFront-Is-Tablet-Viewer": "false",
            "CloudFront-Viewer-Country": "IN",
            "content-type": "application/json",
            "Host": "1hobsh741g.execute-api.ap-south-1.amazonaws.com",
            "origin": "http://localhost:4200",
            "Referer": "http://localhost:4200/settings/changepassword",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.117 Safari/537.36",
            "Via": "2.0 1e1845653f1116e06ee8f549030eac08.cloudfront.net (CloudFront)",
            "X-Amz-Cf-Id": "oqg9HuMki5MSP8fyLb77JCRLoR_6wY1Ck32ti3XI_jiz-qEqT3K6Zg==",
            "X-Amzn-Trace-Id": "Root=1-5c7dfda4-47ab2168183710d470310976",
            "X-Forwarded-For": "106.51.73.130, 52.46.49.153",
            "X-Forwarded-Port": "443",
            "X-Forwarded-Proto": "https"
        },
        "multiValueHeaders": {
            "Accept": [
                "application/json, text/plain, *!/!*"
            ],
            "Accept-Encoding": [
                "gzip, deflate, br"
            ],
            "Accept-Language": [
                "en-GB,en-US;q=0.9,en;q=0.8"
            ],
            "Authorization": [
                "eyJraWQiOiJwc0Mwakpxd2V5RCtVM3FYenB2RVZ4SEI3NXdKYUVUcVwvZlNrTitaWExSbz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJlMDhjYWMzOC1lMjEzLTQ0NzQtODdjNi0wMDc2NDUzOWQ2NDkiLCJkZXZpY2Vfa2V5IjoiYXAtc291dGgtMV9kMDljOTk4Ni01ZTAxLTQyYzYtYmQyNC1iNTdhYWI3ZDVjNTQiLCJldmVudF9pZCI6ImU3NmE5MTk1LTNlNzQtMTFlOS1iODIxLTI3YTJhZTE4NDE5ZSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE1NTE3MDA3NDMsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5hcC1zb3V0aC0xLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoLTFfQVFKSnBoRXg0IiwiZXhwIjoxNTUxNzYzMDc2LCJpYXQiOjE1NTE3NTk0NzYsImp0aSI6ImU5NTc5OTNmLTM1YTgtNDBjOS1hNGM3LWY1ZWJlN2MzNjNlZCIsImNsaWVudF9pZCI6IjUzdDBwbm1zMXE2ZmN1MmpocjVuNG9hY3QzIiwidXNlcm5hbWUiOiJlMDhjYWMzOC1lMjEzLTQ0NzQtODdjNi0wMDc2NDUzOWQ2NDkifQ.lwrDZsSOzW-FYu0ZyEFTlzaK9qqzGVf0-Vh2xjUK92urivETS5xtdwTdOlI0KCNrZGQbHe5-x_K2PbQijZRnqC_HxDICb-n6M60oGfY8NUh4ejMqmc6yYaZG2BfRBCoijLO1y-epMxL-2LVxFr8mhErL788-D_jCjHjsk3B3p8QGeCOA_w0oZ1vVtTNbOCpqEWpDgwU-0xQwoFhjTUqR5E9kjvZVO3aU-BSBfnIzbHqbQxoB36goeDffiNUHzPBEjSzHCAlzmO7hfCwy3R_k6z-cqeBjsJ5SfVw8RnhDcObrjNXOhVwDTJVH_X7FemcfXFDsSUlHKNUSAruT1_8zyA"
            ],
            "CloudFront-Forwarded-Proto": [
                "https"
            ],
            "CloudFront-Is-Desktop-Viewer": [
                "true"
            ],
            "CloudFront-Is-Mobile-Viewer": [
                "false"
            ],
            "CloudFront-Is-SmartTV-Viewer": [
                "false"
            ],
            "CloudFront-Is-Tablet-Viewer": [
                "false"
            ],
            "CloudFront-Viewer-Country": [
                "IN"
            ],
            "content-type": [
                "application/json"
            ],
            "Host": [
                "1hobsh741g.execute-api.ap-south-1.amazonaws.com"
            ],
            "origin": [
                "http://localhost:4200"
            ],
            "Referer": [
                "http://localhost:4200/settings/changepassword"
            ],
            "User-Agent": [
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.117 Safari/537.36"
            ],
            "Via": [
                "2.0 1e1845653f1116e06ee8f549030eac08.cloudfront.net (CloudFront)"
            ],
            "X-Amz-Cf-Id": [
                "oqg9HuMki5MSP8fyLb77JCRLoR_6wY1Ck32ti3XI_jiz-qEqT3K6Zg=="
            ],
            "X-Amzn-Trace-Id": [
                "Root=1-5c7dfda4-47ab2168183710d470310976"
            ],
            "X-Forwarded-For": [
                "106.51.73.130, 52.46.49.153"
            ],
            "X-Forwarded-Port": [
                "443"
            ],
            "X-Forwarded-Proto": [
                "https"
            ]
        },
        "queryStringParameters": null,
        "multiValueQueryStringParameters": null,
        "pathParameters": null,
        "stageVariables": null,
        "requestContext": {
            "resourceId": "jea39r",
            "authorizer": {
                "principalId": "{\"sub\":\"e08cac38-e213-4474-87c6-00764539d649\",\"role\":1,\"_id\":\"5c2c6dbc316bff593dc859cf\"}",
                "integrationLatency": 22
            },
            "resourcePath": "/settings/change-password",
            "httpMethod": "PUT",
            "extendedRequestId": "WDSRvHjkhcwFoDg=",
            "requestTime": "05/Mar/2019:04:40:04 +0000",
            "path": "/Development/settings/change-password",
            "accountId": "786724127547",
            "protocol": "HTTP/1.1",
            "stage": "Development",
            "domainPrefix": "1hobsh741g",
            "requestTimeEpoch": 1551760804720,
            "requestId": "beec0787-3f00-11e9-89d9-b3efb1077f1d",
            "identity": {
                "cognitoIdentityPoolId": null,
                "accountId": null,
                "cognitoIdentityId": null,
                "caller": null,
                "sourceIp": "106.51.73.130",
                "accessKey": null,
                "cognitoAuthenticationType": null,
                "cognitoAuthenticationProvider": null,
                "userArn": null,
                "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.117 Safari/537.36",
                "user": null
            },
            "domainName": "1hobsh741g.execute-api.ap-south-1.amazonaws.com",
            "apiId": "1hobsh741g"
        },
        "body": "{\"newPassword\":\"Dev@1234\"}",
        "isBase64Encoded": false};*/


    exports.handler = (event, context, callback) => {
        console.log(JSON.stringify(event));

        cb = callback;
        context.callbackWaitsForEmptyEventLoop = false;

        getConstant.then(() => {
            //imports
            const db = require('./db').connect();
            const changepassword = require('./changePassword');
            const helper = require('./util');

            if (helper.checkFromTrigger(cb, event)) return;

            //connect to db
            db.then(() => changepassword.changePassword(event, cb)).catch(sendError);

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

