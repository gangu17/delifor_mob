let cb;
const result = require('./result');

try {
    const getConstant = require('./constant')();
    // const callback = function (err, data) {
    //     console.log('callback called+++++++++++++++++++++++++++++++++');
    //     console.log(err, data);
    // };

   // const event = {
   //     "resource": "/task/taskupdate",
   //     "path": "/task/taskupdate",
   //     "httpMethod": "POST",
   //     "headers": {
   //         "Accept": "application/json",
   //         "Accept-Encoding": "gzip",
   //         "Authorization": "eyJraWQiOiJrUUNiMzlGNTFocmcyd21MYjRsRUx2dmYxVENSS21UT3czT3BZSWU2cXVzPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjM2QxNDNhZS01MzI2LTRlOTQtODZkOC05YWI0ZDI4NmYzNTMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV9BUUpKcGhFeDQiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiJjM2QxNDNhZS01MzI2LTRlOTQtODZkOC05YWI0ZDI4NmYzNTMiLCJhdWQiOiI3b2Z0am5oaTJucXNzNnRjZWVkbDBoZTN2ZiIsImV2ZW50X2lkIjoiYWU3ZjcxYzctNWUzZS00NDQwLWJmNGItODkxY2E5NGMxZjNhIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1NjE1Mjg3OTEsIm5hbWUiOiJ2aW5vIiwicGhvbmVfbnVtYmVyIjoiKzkxOTYwMDY1MDkxOCIsImV4cCI6MTU2MTUzMjM5MSwiaWF0IjoxNTYxNTI4NzkxLCJlbWFpbCI6InZpbm8uc0BuZXh0YnJhaW5pdGVjaC5jb20ifQ.EwJf48mWl2XmhW7qa_JzGJh5yMYKe-jf3n8jLlowrgb5tvpGuxhfUaeAfAuNFDIMwdtnPVLJ6azxpI8gYJVgXlPZVXbTezEkhGse6yF8e2kke5N7p7I5egh67EnaSF_qD1Syj-cZeO1ptsi16A8TZzOp85QPmzzP6lhK0mRj1WPRqhBUKh9Kr521WgsJyjMHMq1vEFhLcUBYrL618CiEE4LQ7fVfBc3iTvccnEqML22onbASCDoYFPkVfh5pnuqeVj3Z2xcPCcZkRTgYHyUt_AaVc8qeGVQtkHNpTWJPnCH5Qr8moEuPyS5JiV5TqOaLzoFQAoXHyhegQaH2R1929A",
   //         "CloudFront-Forwarded-Proto": "https",
   //         "CloudFront-Is-Desktop-Viewer": "true",
   //         "CloudFront-Is-Mobile-Viewer": "false",
   //         "CloudFront-Is-SmartTV-Viewer": "false",
   //         "CloudFront-Is-Tablet-Viewer": "false",
   //         "CloudFront-Viewer-Country": "IN",
   //         "content-type": "application/json",
   //         "devicetoken": "dVKEi_SKd3E:APA91bGIxyMjU5p41KVRsc1xOr4pi-_gd677hJOD3A8Vh0WUeH3YumT5WBmsgxzITyrHrVD5wU5Jmy4WjTxzVscjRUb3YWzemjZ8q1u973Co0D_kk2-i7uaJMnqK4MtrV1A8HoewYTFu",
   //         "Host": "za0d3rbfo2.execute-api.ap-south-1.amazonaws.com",
   //         "User-Agent": "okhttp/3.12.0",
   //         "Via": "2.0 dfce9de8da1e307d2b0768f912d1b6cc.cloudfront.net (CloudFront)",
   //         "X-Amz-Cf-Id": "mqFV-YTtMczDRqU9LggoNjE0nLmqO72U7P96xePrKphad6Otu_RDUQ==",
   //         "X-Amzn-Trace-Id": "Root=1-5d130a13-c09ce01e484a85726a8c80bc",
   //         "X-Forwarded-For": "106.51.73.130, 52.46.49.165",
   //         "X-Forwarded-Port": "443",
   //         "X-Forwarded-Proto": "https"
   //     },
   //     "multiValueHeaders": {
   //         "Accept": [
   //             "application/json"
   //         ],
   //         "Accept-Encoding": [
   //             "gzip"
   //         ],
   //         "Authorization": [
   //             "eyJraWQiOiJrUUNiMzlGNTFocmcyd21MYjRsRUx2dmYxVENSS21UT3czT3BZSWU2cXVzPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjM2QxNDNhZS01MzI2LTRlOTQtODZkOC05YWI0ZDI4NmYzNTMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV9BUUpKcGhFeDQiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiJjM2QxNDNhZS01MzI2LTRlOTQtODZkOC05YWI0ZDI4NmYzNTMiLCJhdWQiOiI3b2Z0am5oaTJucXNzNnRjZWVkbDBoZTN2ZiIsImV2ZW50X2lkIjoiYWU3ZjcxYzctNWUzZS00NDQwLWJmNGItODkxY2E5NGMxZjNhIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1NjE1Mjg3OTEsIm5hbWUiOiJ2aW5vIiwicGhvbmVfbnVtYmVyIjoiKzkxOTYwMDY1MDkxOCIsImV4cCI6MTU2MTUzMjM5MSwiaWF0IjoxNTYxNTI4NzkxLCJlbWFpbCI6InZpbm8uc0BuZXh0YnJhaW5pdGVjaC5jb20ifQ.EwJf48mWl2XmhW7qa_JzGJh5yMYKe-jf3n8jLlowrgb5tvpGuxhfUaeAfAuNFDIMwdtnPVLJ6azxpI8gYJVgXlPZVXbTezEkhGse6yF8e2kke5N7p7I5egh67EnaSF_qD1Syj-cZeO1ptsi16A8TZzOp85QPmzzP6lhK0mRj1WPRqhBUKh9Kr521WgsJyjMHMq1vEFhLcUBYrL618CiEE4LQ7fVfBc3iTvccnEqML22onbASCDoYFPkVfh5pnuqeVj3Z2xcPCcZkRTgYHyUt_AaVc8qeGVQtkHNpTWJPnCH5Qr8moEuPyS5JiV5TqOaLzoFQAoXHyhegQaH2R1929A"
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
   //             "application/json"
   //         ],
   //         "devicetoken": [
   //             "dVKEi_SKd3E:APA91bGIxyMjU5p41KVRsc1xOr4pi-_gd677hJOD3A8Vh0WUeH3YumT5WBmsgxzITyrHrVD5wU5Jmy4WjTxzVscjRUb3YWzemjZ8q1u973Co0D_kk2-i7uaJMnqK4MtrV1A8HoewYTFu"
   //         ],
   //         "Host": [
   //             "za0d3rbfo2.execute-api.ap-south-1.amazonaws.com"
   //         ],
   //         "User-Agent": [
   //             "okhttp/3.12.0"
   //         ],
   //         "Via": [
   //             "2.0 dfce9de8da1e307d2b0768f912d1b6cc.cloudfront.net (CloudFront)"
   //         ],
   //         "X-Amz-Cf-Id": [
   //             "mqFV-YTtMczDRqU9LggoNjE0nLmqO72U7P96xePrKphad6Otu_RDUQ=="
   //         ],
   //         "X-Amzn-Trace-Id": [
   //             "Root=1-5d130a13-c09ce01e484a85726a8c80bc"
   //         ],
   //         "X-Forwarded-For": [
   //             "106.51.73.130, 52.46.49.165"
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
   //         "resourceId": "rgkbvr",
   //         "authorizer": {
   //             "claims": {
   //                 "sub": "c3d143ae-5326-4e94-86d8-9ab4d286f353",
   //                 "email_verified": "true",
   //                 "iss": "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_AQJJphEx4",
   //                 "phone_number_verified": "true",
   //                 "cognito:username": "c3d143ae-5326-4e94-86d8-9ab4d286f353",
   //                 "aud": "7oftjnhi2nqss6tceedl0he3vf",
   //                 "event_id": "ae7f71c7-5e3e-4440-bf4b-891ca94c1f3a",
   //                 "token_use": "id",
   //                 "auth_time": "1561528791",
   //                 "name": "vino",
   //                 "phone_number": "+919600650918",
   //                 "exp": "Wed Jun 26 06:59:51 UTC 2019",
   //                 "iat": "Wed Jun 26 05:59:51 UTC 2019",
   //                 "email": "vino.s@nextbrainitech.com"
   //             }
   //         },
   //         "resourcePath": "/task/taskupdate",
   //         "httpMethod": "POST",
   //         "extendedRequestId": "b36DFHKdBcwFfCw=",
   //         "requestTime": "26/Jun/2019:06:00:51 +0000",
   //         "path": "/Development/task/taskupdate",
   //         "accountId": "786724127547",
   //         "protocol": "HTTP/1.1",
   //         "stage": "Development",
   //         "domainPrefix": "za0d3rbfo2",
   //         "requestTimeEpoch": 1561528851709,
   //         "requestId": "c0a19b51-97d7-11e9-aa94-a3ba64196913",
   //         "identity": {
   //             "cognitoIdentityPoolId": null,
   //             "accountId": null,
   //             "cognitoIdentityId": null,
   //             "caller": null,
   //             "sourceIp": "106.51.73.130",
   //             "principalOrgId": null,
   //             "accessKey": null,
   //             "cognitoAuthenticationType": null,
   //             "cognitoAuthenticationProvider": null,
   //             "userArn": null,
   //             "userAgent": "okhttp/3.12.0",
   //             "user": null
   //         },
   //         "domainName": "za0d3rbfo2.execute-api.ap-south-1.amazonaws.com",
   //         "apiId": "za0d3rbfo2"
   //     },
   //     "body": "{\"formattedAddress\":\"1, 1st Cross Rd, Prasanth Extension, Whitefield, Bengaluru, Karnataka 560066, India\\n\",\"adminArray\":[\"9da44235-1011-4f86-818b-1fb84ea57580\",\"65d25302-1de9-4526-826a-91921188ba04\"],\"batteryState\":100,\"reason\":\"\",\"deviceType\":0,\"status\":2,\"driverId\":\"5d077a39040f76885b789e57\",\"driverName\":\"Vino cs\",\"imgUrl\":\"\",\"order\":0,\"otp\":0,\"reSendOtp\":false,\"startLat\":12.9839238,\"startLng\":77.7500315,\"startedTime\":\"2019-06-26T06:00:40.604Z\",\"taskStatus\":22,\"_id\":\"5d1309a891745a5f5ad41cdc\",\"templateName\":\"Products Part\",\"topic\":\"task\",\"activeDist\":0.0}",
   //     "isBase64Encoded": false
   // }

    exports.handler = (event, context, callback) => {
          cb = callback;
         console.log('Event:' + JSON.stringify(event));
    context.callbackWaitsForEmptyEventLoop = false;


    getConstant.then(() => {
        //imports
        const db = require('./db').connect();
        const task = require('./updateTask');
        const helper = require('./util');


        const deviceToken = (event.deviceToken) ? event.deviceToken : helper.getDeviceToken(cb, event);
        const principals = (event.principals) ? event.principals : event.requestContext.authorizer.claims.sub;


        if (!principals) return;
        console.log('principals+++', principals);
        //connect to db
        // checking for normal body event or invoke lambda event
        // event.deviceToken exists if it is invoked from other lambda or else normal parse body data from event
        let bodyData = (event.deviceToken) ? event : helper.getBodyData(event);
        db.then(() => task.updateTask(bodyData , cb, principals, deviceToken)).catch(sendError);

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







