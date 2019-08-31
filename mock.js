module.exports = {
    admin: {
        event:

            {
                "resource": "/changestatus",
                "path": "/changestatus",
                "httpMethod": "POST",
                "headers": {
                    "Accept": "application/json",
                    "Accept-Encoding": "gzip",
                    "Authorization": "eyJraWQiOiJpNjFZbWNnWnNkK1l2UHQ3eHI5eTF0Q3RlcThua0c5XC9oWmhTZldzWm5oZz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI1ZmQ3MjIzMC0zMzQwLTQxYzctOTlhYi0yNmNmNDRhNmU1ZjYiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV96Tk1lVUdnMG8iLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiI1ZmQ3MjIzMC0zMzQwLTQxYzctOTlhYi0yNmNmNDRhNmU1ZjYiLCJhdWQiOiI1bm1maXZsM3Q5Yzd1ZDg1NXFpZDdtZjU3aiIsImV2ZW50X2lkIjoiZWU1NzZhNzgtNjVhYi0xMWU5LWExNGUtZWRiMjc3MzlkODZmIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1NTYwMTI0NzIsIm5hbWUiOiJEcml2ZXIyIiwicGhvbmVfbnVtYmVyIjoiKzkxNDU0NTQ1IiwiZXhwIjoxNTU2MDE2MDcyLCJpYXQiOjE1NTYwMTI0NzIsImVtYWlsIjoiaG9saWRyaXZlcjJAbWFpbGluYXRvci5jb20ifQ.aA82n27_KRELjR0IFSavp9JJKxQWJNtmuAaPuivJGNch9YcS5cQNfwQLz-0qZYF8NvyPx3SVXkAtPHGIvwhosCtg7Qy1FuLAiyuucwc8O3XDdrJ2ElIlbB_atowYGHUlvnuC44KerryiXnXNstbjvXl0q6TCXqGW3CtnS85ZbxiVaooIUigTNKw7svmyk9gU8zGnhbu2Ac7KnzMXtNrUH_JVFHoVWVZ_nQ3JdSznZ6Hlb5jNo9zd1GZsi-cHHjRbGpDc8W8ViuVybb-ijlBBAzgEWt6fVMtzgKGGHRaCX2vcfXMhCcVbe9i5u9eR4sNc2TLreNhcAzF8STnU4wqvQQ",
                    "CloudFront-Forwarded-Proto": "https",
                    "CloudFront-Is-Desktop-Viewer": "true",
                    "CloudFront-Is-Mobile-Viewer": "false",
                    "CloudFront-Is-SmartTV-Viewer": "false",
                    "CloudFront-Is-Tablet-Viewer": "false",
                    "CloudFront-Viewer-Country": "IN",
                    "content-type": "application/json",
                    "devicetoken": "cnJQ9JlVtIc:APA91bHf3-yHoqfyP6ubrg4avw9KxrmpzeLaqwbbwX6B_YWp7ja2NGxj-QcXGFcNrPNOYkRXs4CngJCF2kJlb-gk39cZx-oqrnIZFHX5GY1Y6o_wYKkaFrv4djYoOimDTqP2PDhfbmWv",
                    "Host": "2ocwnhz66m.execute-api.ap-south-1.amazonaws.com",
                    "User-Agent": "okhttp/3.12.0",
                    "Via": "2.0 9c7c2bcc2cb8136de33ca4d25c9defe2.cloudfront.net (CloudFront)",
                    "X-Amz-Cf-Id": "x4RUvsJ4d2xEGS22bHrlBpB8c-tZlTbKNpuMGQktmg1IE4NYIcLAmg==",
                    "X-Amzn-Trace-Id": "Root=1-5cbedefc-3e54381b2d7f455789d6d234",
                    "X-Forwarded-For": "106.51.73.130, 52.46.49.72",
                    "X-Forwarded-Port": "443",
                    "X-Forwarded-Proto": "https"
                },
                "multiValueHeaders": {
                    "Accept": [
                        "application/json"
                    ],
                    "Accept-Encoding": [
                        "gzip"
                    ],
                    "Authorization": [
                        "eyJraWQiOiJpNjFZbWNnWnNkK1l2UHQ3eHI5eTF0Q3RlcThua0c5XC9oWmhTZldzWm5oZz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI1ZmQ3MjIzMC0zMzQwLTQxYzctOTlhYi0yNmNmNDRhNmU1ZjYiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV96Tk1lVUdnMG8iLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiI1ZmQ3MjIzMC0zMzQwLTQxYzctOTlhYi0yNmNmNDRhNmU1ZjYiLCJhdWQiOiI1bm1maXZsM3Q5Yzd1ZDg1NXFpZDdtZjU3aiIsImV2ZW50X2lkIjoiZWU1NzZhNzgtNjVhYi0xMWU5LWExNGUtZWRiMjc3MzlkODZmIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1NTYwMTI0NzIsIm5hbWUiOiJEcml2ZXIyIiwicGhvbmVfbnVtYmVyIjoiKzkxNDU0NTQ1IiwiZXhwIjoxNTU2MDE2MDcyLCJpYXQiOjE1NTYwMTI0NzIsImVtYWlsIjoiaG9saWRyaXZlcjJAbWFpbGluYXRvci5jb20ifQ.aA82n27_KRELjR0IFSavp9JJKxQWJNtmuAaPuivJGNch9YcS5cQNfwQLz-0qZYF8NvyPx3SVXkAtPHGIvwhosCtg7Qy1FuLAiyuucwc8O3XDdrJ2ElIlbB_atowYGHUlvnuC44KerryiXnXNstbjvXl0q6TCXqGW3CtnS85ZbxiVaooIUigTNKw7svmyk9gU8zGnhbu2Ac7KnzMXtNrUH_JVFHoVWVZ_nQ3JdSznZ6Hlb5jNo9zd1GZsi-cHHjRbGpDc8W8ViuVybb-ijlBBAzgEWt6fVMtzgKGGHRaCX2vcfXMhCcVbe9i5u9eR4sNc2TLreNhcAzF8STnU4wqvQQ"
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
                    "devicetoken": [
                        "cnJQ9JlVtIc:APA91bHf3-yHoqfyP6ubrg4avw9KxrmpzeLaqwbbwX6B_YWp7ja2NGxj-QcXGFcNrPNOYkRXs4CngJCF2kJlb-gk39cZx-oqrnIZFHX5GY1Y6o_wYKkaFrv4djYoOimDTqP2PDhfbmWv"
                    ],
                    "Host": [
                        "2ocwnhz66m.execute-api.ap-south-1.amazonaws.com"
                    ],
                    "User-Agent": [
                        "okhttp/3.12.0"
                    ],
                    "Via": [
                        "2.0 9c7c2bcc2cb8136de33ca4d25c9defe2.cloudfront.net (CloudFront)"
                    ],
                    "X-Amz-Cf-Id": [
                        "x4RUvsJ4d2xEGS22bHrlBpB8c-tZlTbKNpuMGQktmg1IE4NYIcLAmg=="
                    ],
                    "X-Amzn-Trace-Id": [
                        "Root=1-5cbedefc-3e54381b2d7f455789d6d234"
                    ],
                    "X-Forwarded-For": [
                        "106.51.73.130, 52.46.49.72"
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
                    "resourceId": "g5dyez",
                    "authorizer": {
                        "claims": {
                            "sub": "5fd72230-3340-41c7-99ab-26cf44a6e5f6",
                            "email_verified": "true",
                            "iss": "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_zNMeUGg0o",
                            "phone_number_verified": "true",
                            "cognito:username": "5fd72230-3340-41c7-99ab-26cf44a6e5f6",
                            "aud": "5nmfivl3t9c7ud855qid7mf57j",
                            "event_id": "ee576a78-65ab-11e9-a14e-edb27739d86f",
                            "token_use": "id",
                            "auth_time": "1556012472",
                            "name": "Driver2",
                            "phone_number": "+91454545",
                            "exp": "Tue Apr 23 10:41:12 UTC 2019",
                            "iat": "Tue Apr 23 09:41:12 UTC 2019",
                            "email": "holidriver2@mailinator.com"
                        }
                    },
                    "resourcePath": "/changestatus",
                    "httpMethod": "POST",
                    "extendedRequestId": "YlfHeHR8hcwFUog=",
                    "requestTime": "23/Apr/2019:09:46:36 +0000",
                    "path": "/Development/changestatus",
                    "accountId": "204006638324",
                    "protocol": "HTTP/1.1",
                    "stage": "Development",
                    "domainPrefix": "2ocwnhz66m",
                    "requestTimeEpoch": 1556012796667,
                    "requestId": "af9e060d-65ac-11e9-9a0e-d9ea378864d3",
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
                        "userAgent": "okhttp/3.12.0",
                        "user": null
                    },
                    "domainName": "2ocwnhz66m.execute-api.ap-south-1.amazonaws.com",
                    "apiId": "2ocwnhz66m"
                },
                "body": "{\"formattedAddress\":\"1, 1st Cross Rd, Prasanth Extension, Whitefield, Bengaluru, Karnataka 560066, India\\n\",\"adminArray\":[\"3a32da1d-53ad-429d-8221-683ea00d10e5\",\"eaa3d42e-9bd0-4504-b71c-e81760ea5033\"],\"batteryState\":100,\"location_lng\":77.7499704,\"location_lat\":12.9839032,\"driverIdleLog\":[],\"status\":1,\"driverId\":\"5cb167ed17d68c6c72efeb3e\",\"isLogOut\":false,\"topic\":\"driver\",\"versionName\":\"1.59\"}",
                "isBase64Encoded": false
            }

    }

};
