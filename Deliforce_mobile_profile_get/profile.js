const constant = require('./constant')();
const taskConst = constant.TASK_STATUS;
const isIt = constant.isIt;
const result = require('./result');
const driverModel = require('./model').driver;
const taskModel = require('./model').task;
const statusListModel = require('./model').statusList;
const siteSettingsModel = require('./model').siteSettings;
const settingModel = require('./model').setting;
const _ = require('lodash');
const table = constant.TABLES;

module.exports = {
    fetchProfile: (event, cb, principals, deviceToken) => {
        const clientId = principals;
        driverModel.findOne({cognitoSub: clientId}, {
            name: isIt.YES,
            lastName: isIt.YES,
            image: isIt.YES,
            driverStatus: isIt.YES,
            _id: isIt.YES,
            email: isIt.YES,
            phone: isIt.YES,
            clientId: isIt.YES,
            settings: isIt.YES,
            deviceToken: isIt.YES,
            glympseUserName :isIt.YES,
            glympsePassword : isIt.YES,
        }).then((profile) => {
            let profileInfo = {};
            console.log('profile', profile);
            if (!_.isEmpty(profile)) {
                profileInfo = (profile) ? profile.toObject() : '';
                if (deviceToken && profileInfo.deviceToken && deviceToken !== profileInfo.deviceToken) {
                    result.duplicateLogin(cb);
                } else {
                    profileInfo.image = (profileInfo && profileInfo.image) ? profileInfo.image : '';
                    profileInfo.lastName = (profileInfo && profileInfo.lastName) ? profileInfo.lastName : '';
                }

            } else {
                profileInfo = {}
            }

            return Promise.all([/*driverModel.findOne({cognitoSub: profileInfo.clientId}, {
                mqttCount: isIt.YES,
                idleUpdateCount: isIt.YES,
                liveTrackingDistanceUpdate: isIt.YES,
                idleDistanceUpdate: isIt.YES,
                isRadiusValidation: isIt.YES,
                radiusDistance: isIt.YES,
                idleDistanceUpdateFrequency: isIt.YES,
                _id: isIt.NO
            })*/
                driverModel.aggregate([
                    {
                        "$match": {cognitoSub: profileInfo.clientId}
                    },
                    {
                        $lookup:
                            {
                                from: table.USERSETTINGS,
                                localField: 'cognitoSub',
                                foreignField: 'clientId',
                                as: 'userSettings'
                            }
                    },
                    {
                        $lookup:
                            {
                                from: table.SETTING,
                                pipeline: [
                                    {
                                        $match: {
                                            clientId: profileInfo.clientId,
                                            'isCurrent' : true

                                        }
                                    }],
                                as: 'settings'
                            }
                    },
                    {
                        $project: {
                            mqttCount: 1,
                            idleUpdateCount: 1,
                            liveTrackingDistanceUpdate: 1,
                            idleDistanceUpdate: 1,
                            isRadiusValidation: 1,
                            radiusDistance: 1,
                            idleDistanceUpdateFrequency: 1,
                            isIdleLogEnable: 1,
                            isTransitRoadApi: 1,
                            isGlympseEnable:1,
                            _id: 0, userSettings: 1,
                            'settings.actionBlock': 1
                        }
                    }
                ]), taskModel.find({
                    driver: profile._id,
                    isDeleted: isIt.NO,
                    taskStatus: taskConst.STARTED
                }, {_id: isIt.YES}),
                siteSettingsModel.find({}), statusListModel.findOne({language: (profile.toObject().settings.language === isIt.YES) ? 'en' : 'es'})]).then((tasks) => {
                console.log('tasks', JSON.stringify(tasks));
                console.log('tasks', JSON.stringify(tasks[0][0].mqttCount));
                var finalRes = Object.assign({}, profileInfo, {'tasks': tasks[1]}, {
                    'mqttCount': tasks[0][0].mqttCount,
                    'idleUpdateCount': tasks[0][0].idleUpdateCount,
                    'liveTrackingDistanceUpdate': tasks[0][0].liveTrackingDistanceUpdate,
                    'idleDistanceUpdateFrequency': tasks[0][0].idleDistanceUpdateFrequency,
                    'idleDistanceUpdate': tasks[0][0].idleDistanceUpdate,
                    'androidVer': tasks[2][0].androidVer,
                    'androidVerUpdate': tasks[2][0].androidVerUpdate,
                    'iOSVer': tasks[2][0].iOSVer,
                    'iOSVerUpdate': tasks[2][0].iOSVerUpdate,
                    'isRadiusValidation': tasks[0][0].isRadiusValidation,
                    'radiusDistance': (tasks[0][0].radiusDistance) ? tasks[0][0].radiusDistance : 0,
                    'taskImagesCount': (tasks[0][0].taskImagesCount) ? tasks[0][0].taskImagesCount : 5,
                    'isEnableDriverCallOption': tasks[0][0].userSettings[0].isEnableDriverCallOption,
                    'isDriverCreateOwnTask': tasks[0][0].userSettings[0].isDriverCreateOwnTask,
                    'isTaskPinCode':tasks[0][0].userSettings[0].isTaskPinCode,
                    'isPODImageCompress':tasks[0][0].userSettings[0].isPODImageCompress,
                    'isIdleLogEnable': tasks[0][0].userSettings[0].isIdleLogEnable,
                    'isEarningsModule':tasks[0][0].userSettings[0].isEarningsModule,
                    'isGlympseEnable':tasks[0][0].userSettings[0].isGlympseEnable,
                    'isZohoEnable':tasks[0][0].userSettings[0].isZohoEnable,
                    'isTransitRoadApi': tasks[0][0].isTransitRoadApi,
                    'StatusList': tasks[3].toObject().status,
                    'distanceRadius': (tasks[0][0].isRadiusValidation && tasks[0][0].settings[0] && tasks[0][0].settings[0].actionBlock.distance) ? tasks[0][0].settings[0].actionBlock.distance : null
            });
                console.log('finalRes', finalRes);
                result.sendSuccess(cb, finalRes);
            }).catch((err) => {
                console.log(err);
                result.sendServerError(cb);
            })

        }).catch((err) => {
            result.sendServerError(cb);
        })
    }
};










