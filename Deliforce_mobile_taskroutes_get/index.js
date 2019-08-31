
let cb;
const result = require('./result');

// const event = {
//     "resource": "/task/taskroutes",
//     "path": "/task/taskroutes",
//     "httpMethod": "GET",
//     "headers": {
//         "Accept": "application/json",
//         "Accept-Encoding": "gzip",
//         "Authorization": "eyJraWQiOiJpNjFZbWNnWnNkK1l2UHQ3eHI5eTF0Q3RlcThua0c5XC9oWmhTZldzWm5oZz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJmYTY1YjcwYi1mZmYyLTQ0NDctYmZjMi01N2MxZDAzMWQ1ZTUiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5hcC1zb3V0aC0xLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoLTFfek5NZVVHZzBvIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjp0cnVlLCJjb2duaXRvOnVzZXJuYW1lIjoiZmE2NWI3MGItZmZmMi00NDQ3LWJmYzItNTdjMWQwMzFkNWU1IiwiYXVkIjoiNW5tZml2bDN0OWM3dWQ4NTVxaWQ3bWY1N2oiLCJldmVudF9pZCI6IjIxNGE4OWJhLTQyNWYtMTFlOS1hODlhLTYzMzE2Yzc4YjM3MSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTUyMTMxMjAxLCJuYW1lIjoicmFtYWNoYW5kcmEgcmVkZHkiLCJwaG9uZV9udW1iZXIiOiIrOTE4ODg0MDkyNjI1IiwiZXhwIjoxNTUyMTQzNDQ4LCJpYXQiOjE1NTIxMzk4NDgsImVtYWlsIjoicmFtYWNoYW5kcmEubm9kZUBnbWFpbC5jb20ifQ.CJWzZauXfxBM-g1Rm46x8Gu1vKJsf2Yg5m4PdPzpFDk5rpbpQgIcNqUntDKVrzM9ycWBpT2FB3fkFXD4i2-Xxvql1OSw_t_NT3BWEkQASpC9hnRaPYtHZSn-LVf5LhXFGfqtv3Mx2XF3K3Zy0kwNyTZy-b2zSmRi8xmCtMx99GCIR7biK68hmsS_iE-NMnXUOGGTqS2w3zcfKV-XLE5LWEZZKs813dElsly2s65dCRsdcnhwhOUJCEVgs5rT1C4N1pW63s7zY2d_7gebev11lUKPm3hZY725VK0GI_TEooe_LIfO_ID5Ivh5umkAhkIH7ZBhyFVwsbKp0EtyWA2s1w",
//         "CloudFront-Forwarded-Proto": "https",
//         "CloudFront-Is-Desktop-Viewer": "true",
//         "CloudFront-Is-Mobile-Viewer": "false",
//         "CloudFront-Is-SmartTV-Viewer": "false",
//         "CloudFront-Is-Tablet-Viewer": "false",
//         "CloudFront-Viewer-Country": "IN",
//         "content-type": "application/json",
//         "Host": "2ocwnhz66m.execute-api.ap-south-1.amazonaws.com",
//         "User-Agent": "okhttp/3.9.0",
//         "Via": "2.0 768fe349e14518bfffafb530144094da.cloudfront.net (CloudFront)",
//         "X-Amz-Cf-Id": "xniBKO_j-mpD51m2I6y5oMsKtCBWo8vRvaF70ZOp8iH4IAK79TWCmg==",
//         "X-Amzn-Trace-Id": "Root=1-5c83ca83-2905827c55386bda0af8bf82",
//         "X-Forwarded-For": "103.252.26.176, 52.46.49.153",
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
//             "eyJraWQiOiJpNjFZbWNnWnNkK1l2UHQ3eHI5eTF0Q3RlcThua0c5XC9oWmhTZldzWm5oZz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJmYTY1YjcwYi1mZmYyLTQ0NDctYmZjMi01N2MxZDAzMWQ1ZTUiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5hcC1zb3V0aC0xLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoLTFfek5NZVVHZzBvIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjp0cnVlLCJjb2duaXRvOnVzZXJuYW1lIjoiZmE2NWI3MGItZmZmMi00NDQ3LWJmYzItNTdjMWQwMzFkNWU1IiwiYXVkIjoiNW5tZml2bDN0OWM3dWQ4NTVxaWQ3bWY1N2oiLCJldmVudF9pZCI6IjIxNGE4OWJhLTQyNWYtMTFlOS1hODlhLTYzMzE2Yzc4YjM3MSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTUyMTMxMjAxLCJuYW1lIjoicmFtYWNoYW5kcmEgcmVkZHkiLCJwaG9uZV9udW1iZXIiOiIrOTE4ODg0MDkyNjI1IiwiZXhwIjoxNTUyMTQzNDQ4LCJpYXQiOjE1NTIxMzk4NDgsImVtYWlsIjoicmFtYWNoYW5kcmEubm9kZUBnbWFpbC5jb20ifQ.CJWzZauXfxBM-g1Rm46x8Gu1vKJsf2Yg5m4PdPzpFDk5rpbpQgIcNqUntDKVrzM9ycWBpT2FB3fkFXD4i2-Xxvql1OSw_t_NT3BWEkQASpC9hnRaPYtHZSn-LVf5LhXFGfqtv3Mx2XF3K3Zy0kwNyTZy-b2zSmRi8xmCtMx99GCIR7biK68hmsS_iE-NMnXUOGGTqS2w3zcfKV-XLE5LWEZZKs813dElsly2s65dCRsdcnhwhOUJCEVgs5rT1C4N1pW63s7zY2d_7gebev11lUKPm3hZY725VK0GI_TEooe_LIfO_ID5Ivh5umkAhkIH7ZBhyFVwsbKp0EtyWA2s1w"
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
//         "Host": [
//             "2ocwnhz66m.execute-api.ap-south-1.amazonaws.com"
//         ],
//         "User-Agent": [
//             "okhttp/3.9.0"
//         ],
//         "Via": [
//             "2.0 768fe349e14518bfffafb530144094da.cloudfront.net (CloudFront)"
//         ],
//         "X-Amz-Cf-Id": [
//             "xniBKO_j-mpD51m2I6y5oMsKtCBWo8vRvaF70ZOp8iH4IAK79TWCmg=="
//         ],
//         "X-Amzn-Trace-Id": [
//             "Root=1-5c83ca83-2905827c55386bda0af8bf82"
//         ],
//         "X-Forwarded-For": [
//             "103.252.26.176, 52.46.49.153"
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
//         "resourceId": "4k3362",
//         "authorizer": {
//             "claims": {
//                 "sub": "fa65b70b-fff2-4447-bfc2-57c1d031d5e5",
//                 "email_verified": "false",
//                 "iss": "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_zNMeUGg0o",
//                 "phone_number_verified": "true",
//                 "cognito:username": "fa65b70b-fff2-4447-bfc2-57c1d031d5e5",
//                 "aud": "5nmfivl3t9c7ud855qid7mf57j",
//                 "event_id": "214a89ba-425f-11e9-a89a-63316c78b371",
//                 "token_use": "id",
//                 "auth_time": "1552131201",
//                 "name": "ramachandra reddy",
//                 "phone_number": "+918884092625",
//                 "exp": "Sat Mar 09 14:57:28 UTC 2019",
//                 "iat": "Sat Mar 09 13:57:28 UTC 2019",
//                 "email": "ramachandra.node@gmail.com"
//             }
//         },
//         "resourcePath": "/task/taskroutes",
//         "httpMethod": "GET",
//         "extendedRequestId": "WRyUiERqBcwFt6w=",
//         "requestTime": "09/Mar/2019:14:15:31 +0000",
//         "path": "/Development/task/taskroutes",
//         "accountId": "204006638324",
//         "protocol": "HTTP/1.1",
//         "stage": "Development",
//         "domainPrefix": "2ocwnhz66m",
//         "requestTimeEpoch": 1552140931409,
//         "requestId": "cc15ac92-4275-11e9-a5e1-718e576fa994",
//         "identity": {
//             "cognitoIdentityPoolId": null,
//             "accountId": null,
//             "cognitoIdentityId": null,
//             "caller": null,
//             "sourceIp": "103.252.26.176",
//             "accessKey": null,
//             "cognitoAuthenticationType": null,
//             "cognitoAuthenticationProvider": null,
//             "userArn": null,
//             "userAgent": "okhttp/3.9.0",
//             "user": null
//         },
//         "domainName": "2ocwnhz66m.execute-api.ap-south-1.amazonaws.com",
//         "apiId": "2ocwnhz66m"
//     },
//     "body": null,
//     "isBase64Encoded": false
// }



try {
     const getConstant = require('./constant')();


// const callback = function(err,data) {
//     console.log('callback called+++++++++++++++++++++++++++++++++');
//     console.log(err, data);
// }

    // event.queryStringParameters = require('../../mock').data.getTasks;
    // console.log(event.queryStringParameters);
   exports.handler = (event, context, callback) => {
        console.log(JSON.stringify(event));
        cb = callback;
      context.callbackWaitsForEmptyEventLoop = false;

        getConstant.then(() => {
            //imports
            const db = require('./db').connect();
            const taskRoutes = require('./fetchTaskRoute');
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
            db.then(() => taskRoutes.fetchRoutes(event, cb, principals, deviceToken)).catch(sendError);

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







