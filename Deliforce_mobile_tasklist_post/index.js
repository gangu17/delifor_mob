let cb;
const result = require('./result');


try {
    const getConstant = require('./constant')();
     // const callback = function (err, data) {
     //     console.log('callback called+++++++++++++++++++++++++++++++++');
     //     console.log(err, data);
     // };

    // const event = {
    //     "resource": "/task/tasklist",
    //     "path": "/task/tasklist",
    //     "httpMethod": "POST",
    //     "headers": {
    //         "Accept": "*/*",
    //         "Accept-Encoding": "br, gzip, deflate",
    //         "Accept-Language": "en-us",
    //         "Authorization": "eyJraWQiOiJrUUNiMzlGNTFocmcyd21MYjRsRUx2dmYxVENSS21UT3czT3BZSWU2cXVzPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI2NDNhMDYwNC1kYWM4LTQ3NDQtYjU4Mi1mMWI5YmM0ZjEzNGEiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV9BUUpKcGhFeDQiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiI2NDNhMDYwNC1kYWM4LTQ3NDQtYjU4Mi1mMWI5YmM0ZjEzNGEiLCJhdWQiOiI2NDczNWI4YXU3NWpiNXFwNzM1ZjFuaWc0aSIsImV2ZW50X2lkIjoiMjZhNGY1YjUtNWI3Zi0xMWU5LWFiYTAtMWI4ZWI5ZTFmZTJiIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1NTQ4OTM3MjcsIm5hbWUiOiJpT1MiLCJwaG9uZV9udW1iZXIiOiIrOTExMTAwIiwiZXhwIjoxNTU0ODk3MzI3LCJpYXQiOjE1NTQ4OTM3MjgsImVtYWlsIjoic2FudDc5ODkwQG1haWxpbmF0b3IuY29tIn0.aeXYVzEVhV7uXPKq-NSiL7sTOeAM8Q74LqmHtVd2Cj4pU2L-03MZJWNdob4vZd36b0Vji1DLYQuGQd0IvQuLdp9DcrnxF1T9BQ6rM46YFybxKijItN3cRWTU0pSQVOzDe9PZtOi8ZbOyIkoiCfpQjYSB-4CjqYFQOdolpq9nQgmn3z3ENWgKr4-kaHgGpyjxIzSpsTlm_G6bxwvx9kobWZhDVUeVMa2o_lTgs6alnIisHD0krfdoeP4xijyW_SZoGKd3hrhd39h6BPkBBKBE-a_B5StUs3HLbq8oci4wNAgs-i8J1_z3JgB8hdBMQ-4qfO_jXO5fa4HI1Gy8WzCFlA",
    //         "CloudFront-Forwarded-Proto": "https",
    //         "CloudFront-Is-Desktop-Viewer": "true",
    //         "CloudFront-Is-Mobile-Viewer": "false",
    //         "CloudFront-Is-SmartTV-Viewer": "false",
    //         "CloudFront-Is-Tablet-Viewer": "false",
    //         "CloudFront-Viewer-Country": "IN",
    //         "content-type": "application/x-www-form-urlencoded",
    //         "devicetoken": "47657282401c88d3546adbd2c4378d6947fdc3376f72c60adaa0232cbd51c7b9",
    //         "Host": "za0d3rbfo2.execute-api.ap-south-1.amazonaws.com",
    //         "User-Agent": "Deliforce%20Agent/1.0 CFNetwork/976 Darwin/18.2.0",
    //         "Via": "2.0 5fc4d4c38db530784c809d42d6ac012c.cloudfront.net (CloudFront)",
    //         "X-Amz-Cf-Id": "L4-hwado4rIZaR5PqyWv04gwzBtE0hovW9z7dswmPUbIX-LBf4kujw==",
    //         "X-Amzn-Trace-Id": "Root=1-5cadcf15-a7d23a5c935ea036f51b066a",
    //         "X-Forwarded-For": "106.51.73.130, 52.46.49.75",
    //         "X-Forwarded-Port": "443",
    //         "X-Forwarded-Proto": "https"
    //     },
    //     "multiValueHeaders": {
    //         "Accept": [
    //             "*/*"
    //         ],
    //         "Accept-Encoding": [
    //             "br, gzip, deflate"
    //         ],
    //         "Accept-Language": [
    //             "en-us"
    //         ],
    //         "Authorization": [
    //             "eyJraWQiOiJrUUNiMzlGNTFocmcyd21MYjRsRUx2dmYxVENSS21UT3czT3BZSWU2cXVzPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI2NDNhMDYwNC1kYWM4LTQ3NDQtYjU4Mi1mMWI5YmM0ZjEzNGEiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV9BUUpKcGhFeDQiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiI2NDNhMDYwNC1kYWM4LTQ3NDQtYjU4Mi1mMWI5YmM0ZjEzNGEiLCJhdWQiOiI2NDczNWI4YXU3NWpiNXFwNzM1ZjFuaWc0aSIsImV2ZW50X2lkIjoiMjZhNGY1YjUtNWI3Zi0xMWU5LWFiYTAtMWI4ZWI5ZTFmZTJiIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1NTQ4OTM3MjcsIm5hbWUiOiJpT1MiLCJwaG9uZV9udW1iZXIiOiIrOTExMTAwIiwiZXhwIjoxNTU0ODk3MzI3LCJpYXQiOjE1NTQ4OTM3MjgsImVtYWlsIjoic2FudDc5ODkwQG1haWxpbmF0b3IuY29tIn0.aeXYVzEVhV7uXPKq-NSiL7sTOeAM8Q74LqmHtVd2Cj4pU2L-03MZJWNdob4vZd36b0Vji1DLYQuGQd0IvQuLdp9DcrnxF1T9BQ6rM46YFybxKijItN3cRWTU0pSQVOzDe9PZtOi8ZbOyIkoiCfpQjYSB-4CjqYFQOdolpq9nQgmn3z3ENWgKr4-kaHgGpyjxIzSpsTlm_G6bxwvx9kobWZhDVUeVMa2o_lTgs6alnIisHD0krfdoeP4xijyW_SZoGKd3hrhd39h6BPkBBKBE-a_B5StUs3HLbq8oci4wNAgs-i8J1_z3JgB8hdBMQ-4qfO_jXO5fa4HI1Gy8WzCFlA"
    //         ],
    //         "CloudFront-Forwarded-Proto": [
    //             "https"
    //         ],
    //         "CloudFront-Is-Desktop-Viewer": [
    //             "true"
    //         ],
    //         "CloudFront-Is-Mobile-Viewer": [
    //             "false"
    //         ],
    //         "CloudFront-Is-SmartTV-Viewer": [
    //             "false"
    //         ],
    //         "CloudFront-Is-Tablet-Viewer": [
    //             "false"
    //         ],
    //         "CloudFront-Viewer-Country": [
    //             "IN"
    //         ],
    //         "content-type": [
    //             "application/x-www-form-urlencoded"
    //         ],
    //         "devicetoken": [
    //             "47657282401c88d3546adbd2c4378d6947fdc3376f72c60adaa0232cbd51c7b9"
    //         ],
    //         "Host": [
    //             "za0d3rbfo2.execute-api.ap-south-1.amazonaws.com"
    //         ],
    //         "User-Agent": [
    //             "Deliforce%20Agent/1.0 CFNetwork/976 Darwin/18.2.0"
    //         ],
    //         "Via": [
    //             "2.0 5fc4d4c38db530784c809d42d6ac012c.cloudfront.net (CloudFront)"
    //         ],
    //         "X-Amz-Cf-Id": [
    //             "L4-hwado4rIZaR5PqyWv04gwzBtE0hovW9z7dswmPUbIX-LBf4kujw=="
    //         ],
    //         "X-Amzn-Trace-Id": [
    //             "Root=1-5cadcf15-a7d23a5c935ea036f51b066a"
    //         ],
    //         "X-Forwarded-For": [
    //             "106.51.73.130, 52.46.49.75"
    //         ],
    //         "X-Forwarded-Port": [
    //             "443"
    //         ],
    //         "X-Forwarded-Proto": [
    //             "https"
    //         ]
    //     },
    //     "queryStringParameters": null,
    //     "multiValueQueryStringParameters": null,
    //     "pathParameters": null,
    //     "stageVariables": null,
    //     "requestContext": {
    //         "resourceId": "rt4wmd",
    //         "authorizer": {
    //             "claims": {
    //                 "sub": "643a0604-dac8-4744-b582-f1b9bc4f134a",
    //                 "email_verified": "true",
    //                 "iss": "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_AQJJphEx4",
    //                 "phone_number_verified": "true",
    //                 "cognito:username": "643a0604-dac8-4744-b582-f1b9bc4f134a",
    //                 "aud": "64735b8au75jb5qp735f1nig4i",
    //                 "event_id": "26a4f5b5-5b7f-11e9-aba0-1b8eb9e1fe2b",
    //                 "token_use": "id",
    //                 "auth_time": "1554893727",
    //                 "name": "iOS",
    //                 "phone_number": "+911100",
    //                 "exp": "Wed Apr 10 11:55:27 UTC 2019",
    //                 "iat": "Wed Apr 10 10:55:28 UTC 2019",
    //                 "email": "sant79890@mailinator.com"
    //             }
    //         },
    //         "resourcePath": "/task/tasklist",
    //         "httpMethod": "POST",
    //         "extendedRequestId": "X61LTH6_BcwFodA=",
    //         "requestTime": "10/Apr/2019:11:10:13 +0000",
    //         "path": "/Development/task/tasklist",
    //         "accountId": "786724127547",
    //         "protocol": "HTTP/1.1",
    //         "stage": "Development",
    //         "domainPrefix": "za0d3rbfo2",
    //         "requestTimeEpoch": 1554894613180,
    //         "requestId": "36528fec-5b81-11e9-b7af-dde140411e50",
    //         "identity": {
    //             "cognitoIdentityPoolId": null,
    //             "accountId": null,
    //             "cognitoIdentityId": null,
    //             "caller": null,
    //             "sourceIp": "106.51.73.130",
    //             "accessKey": null,
    //             "cognitoAuthenticationType": null,
    //             "cognitoAuthenticationProvider": null,
    //             "userArn": null,
    //             "userAgent": "Deliforce%20Agent/1.0 CFNetwork/976 Darwin/18.2.0",
    //             "user": null
    //         },
    //         "domainName": "za0d3rbfo2.execute-api.ap-south-1.amazonaws.com",
    //         "apiId": "za0d3rbfo2"
    //     },
    //     "body": "{\"filter\":{\"search\":\"\",\"sortByTIme\":0,\"dateRange\":[\"2019-04-10\",\"2019-04-10\"],\"statusFilter\":[],\"sortByDistance\":0}}",
    //     "isBase64Encoded": false
    // }
   exports.handler = (event, context, callback) => {
        console.log(JSON.stringify(event));
        cb = callback;
        context.callbackWaitsForEmptyEventLoop = false;

        getConstant.then(() => {
            //imports
            const db = require('./db').connect();
            const task = require('./fetchTaskList');
            const helper = require('./util');

            if (helper.checkFromTrigger(cb, event)) return;


            /*
            principals explanation: for admin sub is clientId for manager clientId is clientId
            {  sub: 'current user cognitosub',
            role: 'role id of user',
            clientId:'exist if user is manager & this is clientid of that manager',
            teams: 'team Assigned to manager' }
            */
            const deviceToken = helper.getDeviceToken(cb, event);
            const principals = event.requestContext.authorizer.claims.sub;
            // const principals="6cada284-4624-4bcc-815c-d49793e2a0c9";
            if (!principals) return;

            //connect to db
            db.then(() => task.fetchTasks(event, cb, principals, deviceToken)).catch(sendError);

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







