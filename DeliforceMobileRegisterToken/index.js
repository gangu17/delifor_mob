let cb;
const result = require('./result');

try {
    const getConstant = require('./constant')();



    // This part is commented because its used for testing purpose.
    // uncomment and comment live usages and proceed for testing (revert back after testing )

      // const callback = function (err, data)
      //  {
      //     console.log('callback called+++++++++++++++++++++++++++++++++');
      //     console.log(err, data);
      //  };
       // console.log(callback);
       // const event = require('../../../mock').driver.event;
       // event.body = require('../../../mock').data.deviceToken;
       // console.log(event.body);

    exports.handler = (event, context, callback) => {
   //  const event = {
   //      "resource": "/user/device-token-register",
   //      "path": "/user/device-token-register",
   //      "httpMethod": "POST",
   //      "headers": {
   //          "Accept": "application/json",
   //          "Accept-Encoding": "gzip",
   //          "Authorization": "eyJraWQiOiJrUUNiMzlGNTFocmcyd21MYjRsRUx2dmYxVENSS21UT3czT3BZSWU2cXVzPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJlMmM4YTEzYi00ZGU1LTQyOWMtODZiOC0yZGRkMGRlNWMzMTIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV9BUUpKcGhFeDQiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiJlMmM4YTEzYi00ZGU1LTQyOWMtODZiOC0yZGRkMGRlNWMzMTIiLCJhdWQiOiI3b2Z0am5oaTJucXNzNnRjZWVkbDBoZTN2ZiIsImV2ZW50X2lkIjoiZTBkYWZhYjYtNDg0Ni00NTNlLTk2YjAtMGVmMDc2NWY2Y2EwIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1NjMyODEzMjUsIm5hbWUiOiJkcml2ZXIxIiwicGhvbmVfbnVtYmVyIjoiKzkxNzg3IiwiZXhwIjoxNTYzMjg0OTI1LCJpYXQiOjE1NjMyODEzMjUsImVtYWlsIjoiYXNkQGFzZC5jb20ifQ.DrL-fJp3U0drtL-UN5eh7L__sIKu4GELqrqPwBjvvIC6cSd6O6w0zoFUcMn_7NLzeMwbTeZTWXlC7mKoJDz8oTmi8NYNqr3IDOtw2zslPWwOwLOvPmRnv0cbkptXAHG9-SsSKvpJBnneM8avOrdo4v0bwJEtsIwdyK1WYmqHbP1wBceAv1Hz9Oy0QTPUFcanvM82MR8gWIY5mEYQVSm9EtaSER5LgipYKvh6rv7u2XRzx60gsB_7Mkvs3diqxs_9U9uc-M-FRPv23qH9KahFmsbPd2e7F6JYRGr9J_MkQA_2dG3PM9OivQRZGm_Ow6QxGTuPCBNX5FpHaldm0xiy3Q",
   //          "CloudFront-Forwarded-Proto": "https",
   //          "CloudFront-Is-Desktop-Viewer": "true",
   //          "CloudFront-Is-Mobile-Viewer": "false",
   //          "CloudFront-Is-SmartTV-Viewer": "false",
   //          "CloudFront-Is-Tablet-Viewer": "false",
   //          "CloudFront-Viewer-Country": "IN",
   //          "content-type": "application/json",
   //          "devicetoken": "eknbETi1R9A:APA91bEGA6Sx2tMV8pKC6VAza5amVvpinBpeKD5RYvHqTGQ38WI7MnJalNTHO1xxmZc-0zpc8fUunWQPErdHTawlDbar8n_0Z90OIDKfbxKPpa_corYM4SNnncoq17Gws3fKGKqqCzoI",
   //          "Host": "za0d3rbfo2.execute-api.ap-south-1.amazonaws.com",
   //          "User-Agent": "okhttp/3.12.0",
   //          "Via": "2.0 9b4bfd22826f5c49036d97ae5791e022.cloudfront.net (CloudFront)",
   //          "X-Amz-Cf-Id": "a1bMFqzlnP3fqhI6HdQgq7fM6D6njwPvxbW1ftGwaPfo0jhE76skJg==",
   //          "X-Amzn-Trace-Id": "Root=1-5d2dc7ad-957db61c135694564f1c15f4",
   //          "X-Forwarded-For": "106.51.73.130, 64.252.148.147",
   //          "X-Forwarded-Port": "443",
   //          "X-Forwarded-Proto": "https"
   //      },
   //      "multiValueHeaders": {
   //          "Accept": [
   //              "application/json"
   //          ],
   //          "Accept-Encoding": [
   //              "gzip"
   //          ],
   //          "Authorization": [
   //              "eyJraWQiOiJrUUNiMzlGNTFocmcyd21MYjRsRUx2dmYxVENSS21UT3czT3BZSWU2cXVzPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJlMmM4YTEzYi00ZGU1LTQyOWMtODZiOC0yZGRkMGRlNWMzMTIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV9BUUpKcGhFeDQiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiJlMmM4YTEzYi00ZGU1LTQyOWMtODZiOC0yZGRkMGRlNWMzMTIiLCJhdWQiOiI3b2Z0am5oaTJucXNzNnRjZWVkbDBoZTN2ZiIsImV2ZW50X2lkIjoiZTBkYWZhYjYtNDg0Ni00NTNlLTk2YjAtMGVmMDc2NWY2Y2EwIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1NjMyODEzMjUsIm5hbWUiOiJkcml2ZXIxIiwicGhvbmVfbnVtYmVyIjoiKzkxNzg3IiwiZXhwIjoxNTYzMjg0OTI1LCJpYXQiOjE1NjMyODEzMjUsImVtYWlsIjoiYXNkQGFzZC5jb20ifQ.DrL-fJp3U0drtL-UN5eh7L__sIKu4GELqrqPwBjvvIC6cSd6O6w0zoFUcMn_7NLzeMwbTeZTWXlC7mKoJDz8oTmi8NYNqr3IDOtw2zslPWwOwLOvPmRnv0cbkptXAHG9-SsSKvpJBnneM8avOrdo4v0bwJEtsIwdyK1WYmqHbP1wBceAv1Hz9Oy0QTPUFcanvM82MR8gWIY5mEYQVSm9EtaSER5LgipYKvh6rv7u2XRzx60gsB_7Mkvs3diqxs_9U9uc-M-FRPv23qH9KahFmsbPd2e7F6JYRGr9J_MkQA_2dG3PM9OivQRZGm_Ow6QxGTuPCBNX5FpHaldm0xiy3Q"
   //          ],
   //          "CloudFront-Forwarded-Proto": [
   //              "https"
   //          ],
   //          "CloudFront-Is-Desktop-Viewer": [
   //              "true"
   //          ],
   //          "CloudFront-Is-Mobile-Viewer": [
   //              "false"
   //          ],
   //          "CloudFront-Is-SmartTV-Viewer": [
   //              "false"
   //          ],
   //          "CloudFront-Is-Tablet-Viewer": [
   //              "false"
   //          ],
   //          "CloudFront-Viewer-Country": [
   //              "IN"
   //          ],
   //          "content-type": [
   //              "application/json"
   //          ],
   //          "devicetoken": [
   //              "eknbETi1R9A:APA91bEGA6Sx2tMV8pKC6VAza5amVvpinBpeKD5RYvHqTGQ38WI7MnJalNTHO1xxmZc-0zpc8fUunWQPErdHTawlDbar8n_0Z90OIDKfbxKPpa_corYM4SNnncoq17Gws3fKGKqqCzoI"
   //          ],
   //          "Host": [
   //              "za0d3rbfo2.execute-api.ap-south-1.amazonaws.com"
   //          ],
   //          "User-Agent": [
   //              "okhttp/3.12.0"
   //          ],
   //          "Via": [
   //              "2.0 9b4bfd22826f5c49036d97ae5791e022.cloudfront.net (CloudFront)"
   //          ],
   //          "X-Amz-Cf-Id": [
   //              "a1bMFqzlnP3fqhI6HdQgq7fM6D6njwPvxbW1ftGwaPfo0jhE76skJg=="
   //          ],
   //          "X-Amzn-Trace-Id": [
   //              "Root=1-5d2dc7ad-957db61c135694564f1c15f4"
   //          ],
   //          "X-Forwarded-For": [
   //              "106.51.73.130, 64.252.148.147"
   //          ],
   //          "X-Forwarded-Port": [
   //              "443"
   //          ],
   //          "X-Forwarded-Proto": [
   //              "https"
   //          ]
   //      },
   //      "queryStringParameters": null,
   //      "multiValueQueryStringParameters": null,
   //      "pathParameters": null,
   //      "stageVariables": null,
   //      "requestContext": {
   //          "resourceId": "oh9w9m",
   //          "authorizer": {
   //              "claims": {
   //                  "sub": "e2c8a13b-4de5-429c-86b8-2ddd0de5c312",
   //                  "email_verified": "true",
   //                  "iss": "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_AQJJphEx4",
   //                  "phone_number_verified": "true",
   //                  "cognito:username": "e2c8a13b-4de5-429c-86b8-2ddd0de5c312",
   //                  "aud": "7oftjnhi2nqss6tceedl0he3vf",
   //                  "event_id": "e0dafab6-4846-453e-96b0-0ef0765f6ca0",
   //                  "token_use": "id",
   //                  "auth_time": "1563281325",
   //                  "name": "driver1",
   //                  "phone_number": "+91787",
   //                  "exp": "Tue Jul 16 13:48:45 UTC 2019",
   //                  "iat": "Tue Jul 16 12:48:45 UTC 2019",
   //                  "email": "asd@asd.com"
   //              }
   //          },
   //          "resourcePath": "/user/device-token-register",
   //          "httpMethod": "POST",
   //          "extendedRequestId": "c6wjLFEghcwFtVg=",
   //          "requestTime": "16/Jul/2019:12:48:45 +0000",
   //          "path": "/Development/user/device-token-register",
   //          "accountId": "786724127547",
   //          "protocol": "HTTP/1.1",
   //          "stage": "Development",
   //          "domainPrefix": "za0d3rbfo2",
   //          "requestTimeEpoch": 1563281325910,
   //          "requestId": "0ca7504f-a7c8-11e9-9c0e-b9d1c303045b",
   //          "identity": {
   //              "cognitoIdentityPoolId": null,
   //              "accountId": null,
   //              "cognitoIdentityId": null,
   //              "caller": null,
   //              "sourceIp": "106.51.73.130",
   //              "principalOrgId": null,
   //              "accessKey": null,
   //              "cognitoAuthenticationType": null,
   //              "cognitoAuthenticationProvider": null,
   //              "userArn": null,
   //              "userAgent": "okhttp/3.12.0",
   //              "user": null
   //          },
   //          "domainName": "za0d3rbfo2.execute-api.ap-south-1.amazonaws.com",
   //          "apiId": "za0d3rbfo2"
   //      },
   //      "body": "{\"appVersion\":\"1.79\",\"batteryState\":100,\"location\":{\"formattedAddress\":\"#44, 2nd floor, 1st cross, 2nd Main Rd, Prasanth Extension, Whitefield, Bengaluru, Karnataka 560066, India\\n\",\"lat\":12.9839317,\"lng\":77.750053},\"deviceName\":\"Samsung SM-G610F\",\"deviceType\":0,\"driverStatus\":1,\"deviceToken\":\"eknbETi1R9A:APA91bEGA6Sx2tMV8pKC6VAza5amVvpinBpeKD5RYvHqTGQ38WI7MnJalNTHO1xxmZc-0zpc8fUunWQPErdHTawlDbar8n_0Z90OIDKfbxKPpa_corYM4SNnncoq17Gws3fKGKqqCzoI\"}",
   //      "isBase64Encoded": false
   //  }

        console.log(JSON.stringify(event));

        cb = callback;
        context.callbackWaitsForEmptyEventLoop = false;

        getConstant.then(() => {
            //imports
            const db = require('./db').connect();
            const deviceToken = require('./deviceToken');
            const helper = require('./util');

            if (helper.checkFromTrigger(cb, event)) return;

            /*
            principals explanation: for admin sub is clientId for manager clientId is clientId
            {  sub: 'current user cognitosub',
            role: 'role id of user',
            clientId:'exist if user is manager & this is clientid of that manager',
            teams: 'team Assigned to manager' }
            */

            const principals = helper.getPrincipals(cb, event);
            if (!principals) return;
            console.log(JSON.stringify(principals));


            //connect to db
            db.then(() => deviceToken.createDeviceToken(event, cb, principals)).catch(sendError);

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















