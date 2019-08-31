let cb;
const result = require('./result');

try {
    const getConstant = require('./constant')();
    // const callback = function (err, data) {
    //     console.log('callback called+++++++++++++++++++++++++++++++++');
    //     console.log(err, data);
    // };

    exports.handler = (event, context, callback) => {

        //  const event = {
        //     "resource": "/user/profile",
        //     "path": "/user/profile",
        //     "httpMethod": "GET",
        //     "headers": {
        //         "Accept": "application/json",
        //         "accept-encoding": "gzip",
        //         "Authorization": "eyJraWQiOiJrUUNiMzlGNTFocmcyd21MYjRsRUx2dmYxVENSS21UT3czT3BZSWU2cXVzPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIwMmQxY2Q4Zi01NGMzLTQxOTQtOWExYi0xMzU5ZGRjYmZhMDkiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV9BUUpKcGhFeDQiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiIwMmQxY2Q4Zi01NGMzLTQxOTQtOWExYi0xMzU5ZGRjYmZhMDkiLCJhdWQiOiI3b2Z0am5oaTJucXNzNnRjZWVkbDBoZTN2ZiIsImV2ZW50X2lkIjoiMTM2ZWQzOTgtMTFjNi00YzI1LTkzNjktZDk1ZTM0OWI1MTdiIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1NjMzNTU5OTksIm5hbWUiOiJzdWdhbnlhMSIsInBob25lX251bWJlciI6Iis5MTEzNCIsImV4cCI6MTU2MzM1OTU5OSwiaWF0IjoxNTYzMzU1OTk5LCJlbWFpbCI6InN1Z2FueWFAZGVsaWZvcmNlLmlvIn0.C2-3shM3m9SUP27GlcjAgpD21Lq6D5UyJAvP8ISNfQJhIzGp0mTEHy-gsQ0Ctc8gxpAO1pLsW26TPGx_d44fEDaZPUTuM9mYajt8iLE0SjUJ08r4Jcn9OZuPEX66d_GLlcPm7k48xopncG0bSsZl-oh-XI62Y1HLm7X7hiTIlJ5SAZQk8rVkzlPyS7MhyAIqniMnSuwOv3gDPYgKQHEKZPfXSeNwbKysse-Vl4wpOPjk1_HSLG2fibkF59HFAv3q6RRo0nYSLcKaPGAjt1TNh9xQQ_A6p7u23akVsogsi8_-EBkGyFWLF2XpyrnK_v6ebZcUhBm6ftEr24-WpibvmQ",
        //         "CloudFront-Forwarded-Proto": "https",
        //         "CloudFront-Is-Desktop-Viewer": "true",
        //         "CloudFront-Is-Mobile-Viewer": "false",
        //         "CloudFront-Is-SmartTV-Viewer": "false",
        //         "CloudFront-Is-Tablet-Viewer": "false",
        //         "CloudFront-Viewer-Country": "IN",
        //         "devicetoken": "diLpVu0odNY:APA91bEVi4U9mlMcJ-vmcv-3BG1Fqv4Xjc73HJ4SaDBx-eirsu2m6ZJAT1qDx2S86ukrGxLqRhjii_sE-lj0263LLSm4ESwaHWCV_11_cLJ4GsK_p_OO019hdfjrKinJGSkn0Rhmo3YB",
        //         "Host": "za0d3rbfo2.execute-api.ap-south-1.amazonaws.com",
        //         "User-Agent": "okhttp/3.12.0",
        //         "Via": "2.0 8c6bb7481f30b8407e3bba2378393547.cloudfront.net (CloudFront)",
        //         "X-Amz-Cf-Id": "YfwSIQh961YkrFKlomyuzC4AbdXhSRmbdc7kpOKdTBmyJ64ld9mS3A==",
        //         "X-Amzn-Trace-Id": "Root=1-5d2ef19f-1c082809bb4b2e2a54035dec",
        //         "X-Forwarded-For": "106.51.73.130, 64.252.145.151",
        //         "X-Forwarded-Port": "443",
        //         "X-Forwarded-Proto": "https"
        //     },
        //     "multiValueHeaders": {
        //         "Accept": [
        //             "application/json"
        //         ],
        //         "accept-encoding": [
        //             "gzip"
        //         ],
        //         "Authorization": [
        //             "eyJraWQiOiJrUUNiMzlGNTFocmcyd21MYjRsRUx2dmYxVENSS21UT3czT3BZSWU2cXVzPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIwMmQxY2Q4Zi01NGMzLTQxOTQtOWExYi0xMzU5ZGRjYmZhMDkiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV9BUUpKcGhFeDQiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiIwMmQxY2Q4Zi01NGMzLTQxOTQtOWExYi0xMzU5ZGRjYmZhMDkiLCJhdWQiOiI3b2Z0am5oaTJucXNzNnRjZWVkbDBoZTN2ZiIsImV2ZW50X2lkIjoiMTM2ZWQzOTgtMTFjNi00YzI1LTkzNjktZDk1ZTM0OWI1MTdiIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1NjMzNTU5OTksIm5hbWUiOiJzdWdhbnlhMSIsInBob25lX251bWJlciI6Iis5MTEzNCIsImV4cCI6MTU2MzM1OTU5OSwiaWF0IjoxNTYzMzU1OTk5LCJlbWFpbCI6InN1Z2FueWFAZGVsaWZvcmNlLmlvIn0.C2-3shM3m9SUP27GlcjAgpD21Lq6D5UyJAvP8ISNfQJhIzGp0mTEHy-gsQ0Ctc8gxpAO1pLsW26TPGx_d44fEDaZPUTuM9mYajt8iLE0SjUJ08r4Jcn9OZuPEX66d_GLlcPm7k48xopncG0bSsZl-oh-XI62Y1HLm7X7hiTIlJ5SAZQk8rVkzlPyS7MhyAIqniMnSuwOv3gDPYgKQHEKZPfXSeNwbKysse-Vl4wpOPjk1_HSLG2fibkF59HFAv3q6RRo0nYSLcKaPGAjt1TNh9xQQ_A6p7u23akVsogsi8_-EBkGyFWLF2XpyrnK_v6ebZcUhBm6ftEr24-WpibvmQ"
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
        //         "devicetoken": [
        //             "diLpVu0odNY:APA91bEVi4U9mlMcJ-vmcv-3BG1Fqv4Xjc73HJ4SaDBx-eirsu2m6ZJAT1qDx2S86ukrGxLqRhjii_sE-lj0263LLSm4ESwaHWCV_11_cLJ4GsK_p_OO019hdfjrKinJGSkn0Rhmo3YB"
        //         ],
        //         "Host": [
        //             "za0d3rbfo2.execute-api.ap-south-1.amazonaws.com"
        //         ],
        //         "User-Agent": [
        //             "okhttp/3.12.0"
        //         ],
        //         "Via": [
        //             "2.0 8c6bb7481f30b8407e3bba2378393547.cloudfront.net (CloudFront)"
        //         ],
        //         "X-Amz-Cf-Id": [
        //             "YfwSIQh961YkrFKlomyuzC4AbdXhSRmbdc7kpOKdTBmyJ64ld9mS3A=="
        //         ],
        //         "X-Amzn-Trace-Id": [
        //             "Root=1-5d2ef19f-1c082809bb4b2e2a54035dec"
        //         ],
        //         "X-Forwarded-For": [
        //             "106.51.73.130, 64.252.145.151"
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
        //         "resourceId": "hb1u8w",
        //         "authorizer": {
        //             "claims": {
        //                 "sub": "02d1cd8f-54c3-4194-9a1b-1359ddcbfa09",
        //                 "email_verified": "true",
        //                 "iss": "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_AQJJphEx4",
        //                 "phone_number_verified": "true",
        //                 "cognito:username": "02d1cd8f-54c3-4194-9a1b-1359ddcbfa09",
        //                 "aud": "7oftjnhi2nqss6tceedl0he3vf",
        //                 "event_id": "136ed398-11c6-4c25-9369-d95e349b517b",
        //                 "token_use": "id",
        //                 "auth_time": "1563355999",
        //                 "name": "suganya1",
        //                 "phone_number": "+91134",
        //                 "exp": "Wed Jul 17 10:33:19 UTC 2019",
        //                 "iat": "Wed Jul 17 09:33:19 UTC 2019",
        //                 "email": "suganya@deliforce.io"
        //             }
        //         },
        //         "resourcePath": "/user/profile",
        //         "httpMethod": "GET",
        //         "extendedRequestId": "c9qw5FJFBcwFt_A=",
        //         "requestTime": "17/Jul/2019:09:59:59 +0000",
        //         "path": "/Development/user/profile",
        //         "accountId": "786724127547",
        //         "protocol": "HTTP/1.1",
        //         "stage": "Development",
        //         "domainPrefix": "za0d3rbfo2",
        //         "requestTimeEpoch": 1563357599352,
        //         "requestId": "a32af056-a879-11e9-8ae7-b9ba5b425226",
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
        //     "body": null,
        //     "isBase64Encoded": false
        // }


        cb = callback;
        context.callbackWaitsForEmptyEventLoop = false;

        getConstant.then(() => {
            //imports
            const db = require('./db').connect();
            const profile = require('./profile');
            const helper = require('./util');

            if (helper.checkFromTrigger(cb, event)) return;
            console.log('event', JSON.stringify(event));
            const deviceToken = helper.getDeviceToken(cb, event);
            let principals = event.requestContext.authorizer.claims.sub;
            if (!principals) return;
            console.log(JSON.stringify(principals));
            //connect to db
            db.then(() => profile.fetchProfile(event, cb, principals, deviceToken)).catch(sendError);

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







