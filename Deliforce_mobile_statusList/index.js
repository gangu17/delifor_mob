let cb;
const result = require('./result');

try {
    const getConstant = require('./constant')();

    // const callback = function (err, data) {
    //     console.log('callback called+++++++++++++++++++++++++++++++++');
    //     console.log(err, data);
    // };
    // const event = {
    //     "resource": "/statuslist",
    //     "path": "/statuslist",
    //     "httpMethod": "GET",
    //     "headers": {
    //     "Accept": "*/*",
    //         "Accept-Encoding": "gzip, deflate, br",
    //         "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
    //         "Authorization": "eyJraWQiOiJpNjFZbWNnWnNkK1l2UHQ3eHI5eTF0Q3RlcThua0c5XC9oWmhTZldzWm5oZz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJkZGMxYWViYi1hYTU1LTRhOTMtYmFjNS1iNmNjNjdiZmI3MGIiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5hcC1zb3V0aC0xLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoLTFfek5NZVVHZzBvIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjp0cnVlLCJjb2duaXRvOnVzZXJuYW1lIjoiZGRjMWFlYmItYWE1NS00YTkzLWJhYzUtYjZjYzY3YmZiNzBiIiwiYXVkIjoiNW5tZml2bDN0OWM3dWQ4NTVxaWQ3bWY1N2oiLCJldmVudF9pZCI6IjBkMzgxZDM5LTI5MDQtMTFlOS05ZWU5LWI5OTgzNzc2ZjNiNCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTQ5MzQzMjk5LCJuYW1lIjoibWFoZXNoIiwicGhvbmVfbnVtYmVyIjoiKzkxOTE0ODA0NjAzMSIsImV4cCI6MTU0OTYxMTMyNywiaWF0IjoxNTQ5NjA3NzI3LCJlbWFpbCI6Im1haGVzaEBtYWlsaW5hdG9yLmNvbSJ9.fQz-cLUfpwl3OHjnUXi_REb-A4xcdp4p6h-2ajJeMfGGq8hGZS7qwgVRGoi6fP7tXJkMRNbrBV86Hib-Szjjqm9M2UpedshMeiIc4GnGEU-1feT_ivLB9dc9Uzqw4loIHi5H-LDZFCzQzUzdqvNs_4uyUHTEOrc5aCH-yE8g79RdmAMMjPvSi69ZUPDXaoWwC4RL7A_84VwtX5_rs3DHM5Wfd7-sa6tTewkxcGN22IZ1KdmDjqGpGom_TnPiJiPfHcHPnPsxevUsZtmCYgixJ8RGHw-o13PNbSzVN5SWYD5SJz_UFsBtPkL7tLOqquTPQ5dDvJ2mhRnGDBq8-WARZw",
    //         "cache-control": "no-cache",
    //         "CloudFront-Forwarded-Proto": "https",
    //         "CloudFront-Is-Desktop-Viewer": "true",
    //         "CloudFront-Is-Mobile-Viewer": "false",
    //         "CloudFront-Is-SmartTV-Viewer": "false",
    //         "CloudFront-Is-Tablet-Viewer": "false",
    //         "CloudFront-Viewer-Country": "IN",
    //         "Host": "fluay3gbph.execute-api.ap-south-1.amazonaws.com",
    //         "postman-token": "25071b5a-d6ab-d5ee-8bb7-c18878368efa",
    //         "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
    //         "Via": "2.0 d56c4bdc887bc98309debbde5409d6f5.cloudfront.net (CloudFront)",
    //         "X-Amz-Cf-Id": "Kdit37buh1J96wcdTAIlJpR--WsNt_X-emg8Gn9PfIfYgp_yl66Pyw==",
    //         "X-Amzn-Trace-Id": "Root=1-5c5d2d48-e540525b2aa17061e29ac58d",
    //         "X-Forwarded-For": "106.51.73.130, 52.46.49.75",
    //         "X-Forwarded-Port": "443",
    //         "X-Forwarded-Proto": "https"
    // },
    //     "multiValueHeaders": {
    //     "Accept": [
    //         "*/*"
    //     ],
    //         "Accept-Encoding": [
    //         "gzip, deflate, br"
    //     ],
    //         "Accept-Language": [
    //         "en-GB,en-US;q=0.9,en;q=0.8"
    //     ],
    //         "Authorization": [
    //         "eyJraWQiOiJpNjFZbWNnWnNkK1l2UHQ3eHI5eTF0Q3RlcThua0c5XC9oWmhTZldzWm5oZz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJkZGMxYWViYi1hYTU1LTRhOTMtYmFjNS1iNmNjNjdiZmI3MGIiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5hcC1zb3V0aC0xLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoLTFfek5NZVVHZzBvIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjp0cnVlLCJjb2duaXRvOnVzZXJuYW1lIjoiZGRjMWFlYmItYWE1NS00YTkzLWJhYzUtYjZjYzY3YmZiNzBiIiwiYXVkIjoiNW5tZml2bDN0OWM3dWQ4NTVxaWQ3bWY1N2oiLCJldmVudF9pZCI6IjBkMzgxZDM5LTI5MDQtMTFlOS05ZWU5LWI5OTgzNzc2ZjNiNCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTQ5MzQzMjk5LCJuYW1lIjoibWFoZXNoIiwicGhvbmVfbnVtYmVyIjoiKzkxOTE0ODA0NjAzMSIsImV4cCI6MTU0OTYxMTMyNywiaWF0IjoxNTQ5NjA3NzI3LCJlbWFpbCI6Im1haGVzaEBtYWlsaW5hdG9yLmNvbSJ9.fQz-cLUfpwl3OHjnUXi_REb-A4xcdp4p6h-2ajJeMfGGq8hGZS7qwgVRGoi6fP7tXJkMRNbrBV86Hib-Szjjqm9M2UpedshMeiIc4GnGEU-1feT_ivLB9dc9Uzqw4loIHi5H-LDZFCzQzUzdqvNs_4uyUHTEOrc5aCH-yE8g79RdmAMMjPvSi69ZUPDXaoWwC4RL7A_84VwtX5_rs3DHM5Wfd7-sa6tTewkxcGN22IZ1KdmDjqGpGom_TnPiJiPfHcHPnPsxevUsZtmCYgixJ8RGHw-o13PNbSzVN5SWYD5SJz_UFsBtPkL7tLOqquTPQ5dDvJ2mhRnGDBq8-WARZw"
    //     ],
    //         "cache-control": [
    //         "no-cache"
    //     ],
    //         "CloudFront-Forwarded-Proto": [
    //         "https"
    //     ],
    //         "CloudFront-Is-Desktop-Viewer": [
    //         "true"
    //     ],
    //         "CloudFront-Is-Mobile-Viewer": [
    //         "false"
    //     ],
    //         "CloudFront-Is-SmartTV-Viewer": [
    //         "false"
    //     ],
    //         "CloudFront-Is-Tablet-Viewer": [
    //         "false"
    //     ],
    //         "CloudFront-Viewer-Country": [
    //         "IN"
    //     ],
    //         "Host": [
    //         "fluay3gbph.execute-api.ap-south-1.amazonaws.com"
    //     ],
    //         "postman-token": [
    //         "25071b5a-d6ab-d5ee-8bb7-c18878368efa"
    //     ],
    //         "User-Agent": [
    //         "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36"
    //     ],
    //         "Via": [
    //         "2.0 d56c4bdc887bc98309debbde5409d6f5.cloudfront.net (CloudFront)"
    //     ],
    //         "X-Amz-Cf-Id": [
    //         "Kdit37buh1J96wcdTAIlJpR--WsNt_X-emg8Gn9PfIfYgp_yl66Pyw=="
    //     ],
    //         "X-Amzn-Trace-Id": [
    //         "Root=1-5c5d2d48-e540525b2aa17061e29ac58d"
    //     ],
    //         "X-Forwarded-For": [
    //         "106.51.73.130, 52.46.49.75"
    //     ],
    //         "X-Forwarded-Port": [
    //         "443"
    //     ],
    //         "X-Forwarded-Proto": [
    //         "https"
    //     ]
    // },
    //     "queryStringParameters": {
    //     "language": "en"
    // },
    //     "multiValueQueryStringParameters": {
    //     "language": [
    //         "en"
    //     ]
    // },
    //     "pathParameters": null,
    //     "stageVariables": null,
    //     "requestContext": {
    //     "resourceId": "2xezpt",
    //         "authorizer": {
    //         "claims": {
    //             "sub": "ddc1aebb-aa55-4a93-bac5-b6cc67bfb70b",
    //                 "email_verified": "false",
    //                 "iss": "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_zNMeUGg0o",
    //                 "phone_number_verified": "true",
    //                 "cognito:username": "ddc1aebb-aa55-4a93-bac5-b6cc67bfb70b",
    //                 "aud": "5nmfivl3t9c7ud855qid7mf57j",
    //                 "event_id": "0d381d39-2904-11e9-9ee9-b9983776f3b4",
    //                 "token_use": "id",
    //                 "auth_time": "1549343299",
    //                 "name": "mahesh",
    //                 "phone_number": "+919148046031",
    //                 "exp": "Fri Feb 08 07:35:27 UTC 2019",
    //                 "iat": "Fri Feb 08 06:35:27 UTC 2019",
    //                 "email": "mahesh@mailinator.com"
    //         }
    //     },
    //     "resourcePath": "/statuslist",
    //         "httpMethod": "GET",
    //         "extendedRequestId": "UxQDYF4fhcwFZMg=",
    //         "requestTime": "08/Feb/2019:07:18:32 +0000",
    //         "path": "/Development/statuslist",
    //         "accountId": "204006638324",
    //         "protocol": "HTTP/1.1",
    //         "stage": "Development",
    //         "domainPrefix": "fluay3gbph",
    //         "requestTimeEpoch": 1549610312864,
    //         "requestId": "bde3ea94-2b71-11e9-815f-ef3dfc7905e6",
    //         "identity": {
    //         "cognitoIdentityPoolId": null,
    //             "accountId": null,
    //             "cognitoIdentityId": null,
    //             "caller": null,
    //             "sourceIp": "106.51.73.130",
    //             "accessKey": null,
    //             "cognitoAuthenticationType": null,
    //             "cognitoAuthenticationProvider": null,
    //             "userArn": null,
    //             "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
    //             "user": null
    //     },
    //     "domainName": "fluay3gbph.execute-api.ap-south-1.amazonaws.com",
    //         "apiId": "fluay3gbph"
    // },
    //     "body": null,
    //     "isBase64Encoded": false
    // }


    exports.handler = (event, context, callback) => {
        console.log(JSON.stringify(event));
        cb = callback;
        context.callbackWaitsForEmptyEventLoop = false;
        getConstant.then((constantData) => {
            console.log(JSON.stringify(constantData) + 'constant heree');

            //imports

            const db = require('./db').connect();
            const getStatus = require('./getStatusList');
            const helper = require('./util');


            //  if (helper.checkFromTrigger(cb, event)) return;
            const principals = event.requestContext.authorizer.claims.sub;
            if (!principals) return;
            console.log(JSON.stringify(principals));


            //connect to db
            db.then(() => getStatus.statusList(event, cb)).catch(sendError);

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







