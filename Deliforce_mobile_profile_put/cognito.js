const AWS = require('aws-sdk');
const constant = require('./constant')();
AWS.config.update({region: constant.AWS.region});
const options = {apiVersion: '2016-04-18', accessKeyId: constant.accessKeyId, secretAccessKey: constant.secretAccessKey};
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(options);


module.exports = {
    updateUser: function (user, userName) {
        return new Promise((resolve, reject) => {

            // Define User Attributes
            const attributeList = [];

            if (user.name) {
                const dataName = {
                    "Name": 'name',
                    "Value": user.name
                };
                attributeList.push(dataName);
            }

            if (user.email) {
                const dataEmail = {
                    "Name": "email",
                    "Value": user.email
                };


                const dataEmailVerify = {
                    "Name": 'email_verified',
                    "Value": 'true'
                };
                attributeList.push(dataEmail, dataEmailVerify);
            }

            if (user.phone) {
                const dataPhone = {
                    "Name": 'phone_number',
                    "Value": user.phone.replace(' ', '')
                };


                const dataPhoneVerify = {
                    "Name": 'phone_number_verified',
                    "Value": 'true'
                };
                attributeList.push(dataPhone, dataPhoneVerify);
            }


            console.log('constrant', JSON.stringify(constant));
            var params = {
                UserAttributes: attributeList,
                UserPoolId: constant.AWS.userPoolId, /* required */
                Username: userName /* required */
            };
            cognitoidentityserviceprovider.adminUpdateUserAttributes(params, function (err, data) {
                if (err) reject(err); // an error occurred
                else resolve();           // successful response
            });

        });
    }
};
