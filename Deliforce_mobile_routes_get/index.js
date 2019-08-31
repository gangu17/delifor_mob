
let cb;
const result = require('./result');

try {
  const getConstant = require('./constant')();
  // const callback = function (err, data) {
  //   console.log('callback called+++++++++++++++++++++++++++++++++');
  //   console.log(err, data);
  // };
  // const event = {
  //         "resource": "/task/tasklist",
  //         "path": "/task/tasklist",
  //         "httpMethod": "POST",
  //         "headers": {
  //             "Accept": "application/json",
  //             "Accept-Encoding": "gzip",
  //             "Authorization": "eyJraWQiOiJpNjFZbWNnWnNkK1l2UHQ3eHI5eTF0Q3RlcThua0c5XC9oWmhTZldzWm5oZz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMzM0ZjY1MS0zZDdhLTRjN2UtODk3NC1hYmRiNmZmZTdlODgiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV96Tk1lVUdnMG8iLCJjb2duaXRvOnVzZXJuYW1lIjoiMTMzNGY2NTEtM2Q3YS00YzdlLTg5NzQtYWJkYjZmZmU3ZTg4IiwiYXVkIjoiNW5tZml2bDN0OWM3dWQ4NTVxaWQ3bWY1N2oiLCJldmVudF9pZCI6ImJkZWM5ODYxLWRmNWEtMTFlOC04N2M3LTg5OGQ5M2ExYWYzNSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTQxMjQ0MTQ2LCJuYW1lIjoidGVzdCIsInBob25lX251bWJlciI6Iis5MTk5MDg3NTExOTgiLCJleHAiOjE1NDEyNDc3NDYsImlhdCI6MTU0MTI0NDE0NiwiZW1haWwiOiJtYWhlc2g0LnRhcmdldEBnbWFpbC5jb20ifQ.dIt7ZW8kUEfGm3_FhrkhyT3ulZaVEKPCMpLhsvKqL4Q2_y6pizXOCKxRBtAHe2sdgnO4Qgw_0kI15UMEJiELkBtBIx19tAXmakSJL_zQeNsBBxH9Mr1eZijGgGhFZavx3Z04Vt13dgtmQQM64hiaMYQqyMIcoird9uFDn_FpUut-252SRmp2k__zExunKl_q6FRm1YTt_iZAERhtgleBVoo2qqKOqW41bfOTnW1ZRxevYw6mKQ36XoRyic6rGStceJZpvLL-I7-tIORWJbfv_dBWPleZz8YoeJfwTMouHKJfAvETGxZxHlr-gY7b8Z_TEc9CS_ZZdD6pxHPBdVYHtA",
  //             "CloudFront-Forwarded-Proto": "https",
  //             "CloudFront-Is-Desktop-Viewer": "true",
  //             "CloudFront-Is-Mobile-Viewer": "false",
  //             "CloudFront-Is-SmartTV-Viewer": "false",
  //             "CloudFront-Is-Tablet-Viewer": "false",
  //             "CloudFront-Viewer-Country": "IN",
  //             "content-type": "application/json",
  //             "Host": "fluay3gbph.execute-api.ap-south-1.amazonaws.com",
  //             "User-Agent": "okhttp/3.9.0",
  //             "Via": "2.0 428accddf0bcba8a5fca3432ef227861.cloudfront.net (CloudFront)",
  //             "X-Amz-Cf-Id": "056ayQ7eNnyIyXjwDqqfVqsP0VBeTpDPm2MN2UEI6u4pwJlew8D_2A==",
  //             "X-Amzn-Trace-Id": "Root=1-5bdd8d2b-da8d3ced464b84d709aadf77",
  //             "X-Forwarded-For": "106.51.73.130, 54.239.160.108",
  //             "X-Forwarded-Port": "443",
  //             "X-Forwarded-Proto": "https"
  //         },
  //         "multiValueHeaders": {
  //             "Accept": [
  //                 "application/json"
  //             ],
  //             "Accept-Encoding": [
  //                 "gzip"
  //             ],
  //             "Authorization": [
  //                 "eyJraWQiOiJpNjFZbWNnWnNkK1l2UHQ3eHI5eTF0Q3RlcThua0c5XC9oWmhTZldzWm5oZz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMzM0ZjY1MS0zZDdhLTRjN2UtODk3NC1hYmRiNmZmZTdlODgiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV96Tk1lVUdnMG8iLCJjb2duaXRvOnVzZXJuYW1lIjoiMTMzNGY2NTEtM2Q3YS00YzdlLTg5NzQtYWJkYjZmZmU3ZTg4IiwiYXVkIjoiNW5tZml2bDN0OWM3dWQ4NTVxaWQ3bWY1N2oiLCJldmVudF9pZCI6ImJkZWM5ODYxLWRmNWEtMTFlOC04N2M3LTg5OGQ5M2ExYWYzNSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTQxMjQ0MTQ2LCJuYW1lIjoidGVzdCIsInBob25lX251bWJlciI6Iis5MTk5MDg3NTExOTgiLCJleHAiOjE1NDEyNDc3NDYsImlhdCI6MTU0MTI0NDE0NiwiZW1haWwiOiJtYWhlc2g0LnRhcmdldEBnbWFpbC5jb20ifQ.dIt7ZW8kUEfGm3_FhrkhyT3ulZaVEKPCMpLhsvKqL4Q2_y6pizXOCKxRBtAHe2sdgnO4Qgw_0kI15UMEJiELkBtBIx19tAXmakSJL_zQeNsBBxH9Mr1eZijGgGhFZavx3Z04Vt13dgtmQQM64hiaMYQqyMIcoird9uFDn_FpUut-252SRmp2k__zExunKl_q6FRm1YTt_iZAERhtgleBVoo2qqKOqW41bfOTnW1ZRxevYw6mKQ36XoRyic6rGStceJZpvLL-I7-tIORWJbfv_dBWPleZz8YoeJfwTMouHKJfAvETGxZxHlr-gY7b8Z_TEc9CS_ZZdD6pxHPBdVYHtA"
  //             ],
  //             "CloudFront-Forwarded-Proto": [
  //                 "https"
  //             ],
  //             "CloudFront-Is-Desktop-Viewer": [
  //                 "true"
  //             ],
  //             "CloudFront-Is-Mobile-Viewer": [
  //                 "false"
  //             ],
  //             "CloudFront-Is-SmartTV-Viewer": [
  //                 "false"
  //             ],
  //             "CloudFront-Is-Tablet-Viewer": [
  //                 "false"
  //             ],
  //             "CloudFront-Viewer-Country": [
  //                 "IN"
  //             ],
  //             "content-type": [
  //                 "application/json"
  //             ],
  //             "Host": [
  //                 "fluay3gbph.execute-api.ap-south-1.amazonaws.com"
  //             ],
  //             "User-Agent": [
  //                 "okhttp/3.9.0"
  //             ],
  //             "Via": [
  //                 "2.0 428accddf0bcba8a5fca3432ef227861.cloudfront.net (CloudFront)"
  //             ],
  //             "X-Amz-Cf-Id": [
  //                 "056ayQ7eNnyIyXjwDqqfVqsP0VBeTpDPm2MN2UEI6u4pwJlew8D_2A=="
  //             ],
  //             "X-Amzn-Trace-Id": [
  //                 "Root=1-5bdd8d2b-da8d3ced464b84d709aadf77"
  //             ],
  //             "X-Forwarded-For": [
  //                 "106.51.73.130, 54.239.160.108"
  //             ],
  //             "X-Forwarded-Port": [
  //                 "443"
  //             ],
  //             "X-Forwarded-Proto": [
  //                 "https"
  //             ]
  //         },
  //         "queryStringParameters": null,
  //         "multiValueQueryStringParameters": null,
  //         "pathParameters": null,
  //         "stageVariables": null,
  //         "requestContext": {
  //             "resourceId": "ukpmhr",
  //             "authorizer": {
  //                 "claims": {
  //                     "sub": "1334f651-3d7a-4c7e-8974-abdb6ffe7e88",
  //                     "email_verified": "true",
  //                     "iss": "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_zNMeUGg0o",
  //                     "cognito:username": "1334f651-3d7a-4c7e-8974-abdb6ffe7e88",
  //                     "aud": "5nmfivl3t9c7ud855qid7mf57j",
  //                     "event_id": "bdec9861-df5a-11e8-87c7-898d93a1af35",
  //                     "token_use": "id",
  //                     "auth_time": "1541244146",
  //                     "name": "test",
  //                     "phone_number": "+919908751198",
  //                     "exp": "Sat Nov 03 12:22:26 UTC 2018",
  //                     "iat": "Sat Nov 03 11:22:26 UTC 2018",
  //                     "email": "mahesh4.target@gmail.com"
  //                 }
  //             },
  //             "resourcePath": "/task/tasklist",
  //             "httpMethod": "POST",
  //             "extendedRequestId": "PyL-uGDnhcwFQsA=",
  //             "requestTime": "03/Nov/2018:11:57:31 +0000",
  //             "path": "/Development/task/tasklist",
  //             "accountId": "204006638324",
  //             "protocol": "HTTP/1.1",
  //             "stage": "Development",
  //             "domainPrefix": "fluay3gbph",
  //             "requestTimeEpoch": 1541246251082,
  //             "requestId": "a4938b8f-df5f-11e8-aa81-277325048bf5",
  //             "identity": {
  //                 "cognitoIdentityPoolId": null,
  //                 "accountId": null,
  //                 "cognitoIdentityId": null,
  //                 "caller": null,
  //                 "sourceIp": "106.51.73.130",
  //                 "accessKey": null,
  //                 "cognitoAuthenticationType": null,
  //                 "cognitoAuthenticationProvider": null,
  //                 "userArn": null,
  //                 "userAgent": "okhttp/3.9.0",
  //                 "user": null
  //             },
  //             "domainName": "fluay3gbph.execute-api.ap-south-1.amazonaws.com",
  //             "apiId": "fluay3gbph"
  //         },
  //         "body": "{\"filter\":{\"dateRange\":[\"2018-11-03T11:57:31.024Z\",\"2018-11-03T11:57:31.025Z\"],\"search\":\"\",\"sortByDistance\":1,\"sortByTIme\":0,\"statusFilter\":[]}}",
  //         "isBase64Encoded": false
  //     }

  exports.handler = (event, context, callback) => {

    cb = callback;
    context.callbackWaitsForEmptyEventLoop = false;

    getConstant.then(() => {
      //imports
      const db = require('./db').connect();
      const fetchTaskRoute = require('./fetchTaskRoute');
      const helper = require('./util');

      if (helper.checkFromTrigger(cb, event)) return;

         const principals = event.requestContext.authorizer.claims.sub;
         //const principals='1334f651-3d7a-4c7e-8974-abdb6ffe7e88';
        if (!principals) return;

        console.log('principals+++',principals);

      db.then(() => fetchTaskRoute.fetchRoutes(event, cb, principals)).catch(sendError);

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







