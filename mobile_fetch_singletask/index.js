let cb;
const result = require('./result');


try {
     const getConstant = require('./constant')();
  //   const callback = function (err, data) {
  //       console.log('callback called+++++++++++++++++++++++++++++++++');
  //       console.log(err, data);
  //   };
  // const event = {
  //     "resource": "/fetchparticulartask",
  //     "path": "/fetchparticulartask",
  //     "httpMethod": "POST",
  //     "headers": {
  //         "Accept": "application/json",
  //         "Accept-Encoding": "gzip",
  //         "Authorization": "eyJraWQiOiJrUUNiMzlGNTFocmcyd21MYjRsRUx2dmYxVENSS21UT3czT3BZSWU2cXVzPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjM2QxNDNhZS01MzI2LTRlOTQtODZkOC05YWI0ZDI4NmYzNTMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV9BUUpKcGhFeDQiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiJjM2QxNDNhZS01MzI2LTRlOTQtODZkOC05YWI0ZDI4NmYzNTMiLCJhdWQiOiI3b2Z0am5oaTJucXNzNnRjZWVkbDBoZTN2ZiIsImV2ZW50X2lkIjoiYWU3ZjcxYzctNWUzZS00NDQwLWJmNGItODkxY2E5NGMxZjNhIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1NjE1Mjg3OTEsIm5hbWUiOiJ2aW5vIiwicGhvbmVfbnVtYmVyIjoiKzkxOTYwMDY1MDkxOCIsImV4cCI6MTU2MTU0NDAxMCwiaWF0IjoxNTYxNTQwNDEwLCJlbWFpbCI6InZpbm8uc0BuZXh0YnJhaW5pdGVjaC5jb20ifQ.TrvrrOhXVSC02eAwriJxwgBmiuI7trJ8NlgXo5VtpK2-9ys_kLZXaDz5W48YvfBPxnrIT9nMAKoikb0yR2y5EUyI_0bDQeo116w1QtpKWwFVTPzxe14xg3riGY7NqtEao-P9rV-A2KIO1QfsIjRXp1IR6TDMw8Epp2G1MtQAviRQ7XoH7a8qgmMiPMVlf8xdSyu5z-CvOQ5wDHUYnQPXW1S9-WDAMmHRSoL8rcjsxQbXUUClbb5ILVNrd0TLZWzs4M_BMkDMHXJw_mkaMdaHZu9dJ_k5oa349Z6c0SF4aLibd_F8JMjZvZYZU05JApIdevaO6HQU-LcwAv5mgLOAJQ",
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
  //         "Via": "2.0 017d342814c21e57a8ef05ae15be24f5.cloudfront.net (CloudFront)",
  //         "X-Amz-Cf-Id": "ygmzucISKnzSRxanUWuFz0kEdE4Ie7Ui_WmOCfuDcwGqER6wBTVkBg==",
  //         "X-Amzn-Trace-Id": "Root=1-5d13406c-8811454657b0033a6cef7c2b",
  //         "X-Forwarded-For": "106.51.73.130, 52.46.49.145",
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
  //             "eyJraWQiOiJrUUNiMzlGNTFocmcyd21MYjRsRUx2dmYxVENSS21UT3czT3BZSWU2cXVzPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjM2QxNDNhZS01MzI2LTRlOTQtODZkOC05YWI0ZDI4NmYzNTMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV9BUUpKcGhFeDQiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiJjM2QxNDNhZS01MzI2LTRlOTQtODZkOC05YWI0ZDI4NmYzNTMiLCJhdWQiOiI3b2Z0am5oaTJucXNzNnRjZWVkbDBoZTN2ZiIsImV2ZW50X2lkIjoiYWU3ZjcxYzctNWUzZS00NDQwLWJmNGItODkxY2E5NGMxZjNhIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1NjE1Mjg3OTEsIm5hbWUiOiJ2aW5vIiwicGhvbmVfbnVtYmVyIjoiKzkxOTYwMDY1MDkxOCIsImV4cCI6MTU2MTU0NDAxMCwiaWF0IjoxNTYxNTQwNDEwLCJlbWFpbCI6InZpbm8uc0BuZXh0YnJhaW5pdGVjaC5jb20ifQ.TrvrrOhXVSC02eAwriJxwgBmiuI7trJ8NlgXo5VtpK2-9ys_kLZXaDz5W48YvfBPxnrIT9nMAKoikb0yR2y5EUyI_0bDQeo116w1QtpKWwFVTPzxe14xg3riGY7NqtEao-P9rV-A2KIO1QfsIjRXp1IR6TDMw8Epp2G1MtQAviRQ7XoH7a8qgmMiPMVlf8xdSyu5z-CvOQ5wDHUYnQPXW1S9-WDAMmHRSoL8rcjsxQbXUUClbb5ILVNrd0TLZWzs4M_BMkDMHXJw_mkaMdaHZu9dJ_k5oa349Z6c0SF4aLibd_F8JMjZvZYZU05JApIdevaO6HQU-LcwAv5mgLOAJQ"
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
  //             "2.0 017d342814c21e57a8ef05ae15be24f5.cloudfront.net (CloudFront)"
  //         ],
  //         "X-Amz-Cf-Id": [
  //             "ygmzucISKnzSRxanUWuFz0kEdE4Ie7Ui_WmOCfuDcwGqER6wBTVkBg=="
  //         ],
  //         "X-Amzn-Trace-Id": [
  //             "Root=1-5d13406c-8811454657b0033a6cef7c2b"
  //         ],
  //         "X-Forwarded-For": [
  //             "106.51.73.130, 52.46.49.145"
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
  //         "resourceId": "l3t2ta",
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
  //                 "exp": "Wed Jun 26 10:13:30 UTC 2019",
  //                 "iat": "Wed Jun 26 09:13:30 UTC 2019",
  //                 "email": "vino.s@nextbrainitech.com"
  //             }
  //         },
  //         "resourcePath": "/fetchparticulartask",
  //         "httpMethod": "POST",
  //         "extendedRequestId": "b4cA9EaqhcwFsVA=",
  //         "requestTime": "26/Jun/2019:09:52:44 +0000",
  //         "path": "/Development/fetchparticulartask",
  //         "accountId": "786724127547",
  //         "protocol": "HTTP/1.1",
  //         "stage": "Development",
  //         "domainPrefix": "za0d3rbfo2",
  //         "requestTimeEpoch": 1561542764514,
  //         "requestId": "254f059f-97f8-11e9-b081-31a3531c4a79",
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
  //     "body": "{\"_id\":\"5d132623120693827096cded\"}",
  //     "isBase64Encoded": false
  // }

  exports.handler = (event, context, callback) => {

        console.log('Event:' + JSON.stringify(event));

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
            //   const principals="3628e1a2-d041-4cd6-85e3-dfb40a882839";
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







