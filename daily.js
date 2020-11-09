const request = require('request');
const fs = require('fs');
const logger = require('tracer').colorConsole({
    format: '{{timestamp}} <{{title}}> {{message}}',
    dateformat: 'yyyy-mm-dd HH:MM:ss Z',
    transport: [
        function (data) {
            fs.appendFile('./reports.log', `${data.rawoutput}\n`, function(error) {
                if (error) throw error;
            });
        },
        function (data) {
            console.log(data.output);
        }
    ],
    filters: [
        filterLogs
    ]
});

var host = process.argv[2];
var username = process.argv[3];
var password = process.argv[4];

const maxTemperature = 36.7;
var randomTemperature = 36.5 + (Math.floor(Math.random() * 2.4) / 10);

function filterLogs(str) {
    let result = str;
    result = result.replace(new RegExp(host, 'g'), 'Host');
    result = result.replace(/((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g, 'IP');
    return result;
}

function login(username, password) {
    return new Promise(function(resolve, reject) {
        let requestData = {"username": username, "password": password};
        request({
            url: `https://${host}/api/login`,
            method: "POST",
            headers: {
                "content-type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat"
            },
            body: JSON.stringify(requestData)
        }, function(error, response, body) {
            if (error) {
                return reject(error);
            }
            if (response.statusCode != 200) {
                return reject(`${response.statusCode} ${response.statusMessage}`);
            }
            resolve(JSON.parse(body));
        });
    });
}

function daily(temperature, token) {
    return new Promise(function(resolve, reject) {
        let requestData = {
            "isIos": false,
            "showInfo": [
                "faculty",
                "profession",
                "grade",
                "clazz",
                "realName",
                "username"
            ],
            "addressMark": true,
            "ifShow": false,
            "isShowOther": false,
            "propsConfig": {
                "id": "dictId",
                "name": "dictName",
                "checked": "selectFlag"
            },
            "sysItems": [
                {
                    "dictId": "a82371dc602c11eab80400ff40e3d7a5",
                    "dictName": "发热",
                    "selectFlag": 0
                },
                {
                    "dictId": "a8254634602c11eab80400ff40e3d7a5",
                    "dictName": "流涕",
                    "selectFlag": 0
                },
                {
                    "dictId": "a82659fb602c11eab80400ff40e3d7a5",
                    "dictName": "咽痛",
                    "selectFlag": 0
                },
                {
                    "dictId": "a827b93a602c11eab80400ff40e3d7a5",
                    "dictName": "咳痰",
                    "selectFlag": 0
                },
                {
                    "dictId": "a8289bd7602c11eab80400ff40e3d7a5",
                    "dictName": "胸痛",
                    "selectFlag": 0
                },
                {
                    "dictId": "a8297b55602c11eab80400ff40e3d7a5",
                    "dictName": "肌肉酸痛",
                    "selectFlag": 0
                },
                {
                    "dictId": "a82a5897602c11eab80400ff40e3d7a5",
                    "dictName": "关节痛",
                    "selectFlag": 0
                },
                {
                    "dictId": "a82b00a4602c11eab80400ff40e3d7a5",
                    "dictName": "气促",
                    "selectFlag": 0
                },
                {
                    "dictId": "a82be7b1602c11eab80400ff40e3d7a5",
                    "dictName": "腹泻",
                    "selectFlag": 0
                },
                {
                    "dictId": "a8245e02602c11eab80400ff40e3d7a5",
                    "dictName": "咳嗽",
                    "selectFlag": 0
                },
                {
                    "dictId": "d2b8adc3642111ea900c4ccc6a8cdd3f",
                    "dictName": "其他",
                    "selectFlag": 0
                }
            ],
            "typeRadio": [
                {
                    "id": 0,
                    "name": "早报",
                    "checked": true
                },
                {
                    "id": 1,
                    "name": "午报",
                    "checked": false
                },
                {
                    "id": 2,
                    "name": "晚报",
                    "checked": false
                },
                {
                    "id": 3,
                    "name": "补报",
                    "checked": false
                }
            ],
            "typeRadio2": [],
            "type_health": [
                {
                    "id": "d2b8adc3642111ea900c4ccc6a8cdd3e",
                    "name": "健康",
                    "checked": true
                },
                {
                    "id": "",
                    "name": "不健康",
                    "checked": false
                }
            ],
            "rules": {
                "temperature": {
                    "valid": "isTemperature",
                    "message": "体温填报范围在30~45之间"
                },
                "address": {
                    "valid": "isRequired",
                    "message": "地理位置异常，请开放定位权限"
                }
            },
            "isChangeBt": false,
            "fillFlag": 0,
            "temperature": `${temperature}`,
            "address": "地址异常",
            "heathyIf": "d2b8adc3642111ea900c4ccc6a8cdd3e",
            "symptomList": [
                {
                    "symptom": "d2b8adc3642111ea900c4ccc6a8cdd3e"
                }
            ],
            "otherSymptom": "",
            "timeColumns": [],
            "dateIndex": 0,
            "fillFlag2": "",
            "fillTime": null
        };
        request({
            url: `https://${host}/api/hm/daily/insert.htmls`,
            method: "POST",
            headers: {
                "content-type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat",
                "token": token
            },
            body: JSON.stringify(requestData)
        }, function(error, response, body) {
            if (error) {
                return reject(error);
            }
            if (response.statusCode != 200) {
                return reject(`${response.statusCode} ${response.statusMessage}`);
            }
            resolve(JSON.parse(body));
        });
    });
}

async function run() {
    process.exitCode = 1;
    if (randomTemperature > maxTemperature) {
        logger.warn(`${randomTemperature}℃已超过允许的体温最大值，程序中止运行！`);
        return;
    }
    let token;
    try {
        let result = await login(username, password);
        if (result.code == 1) {
            token = result.data.token;
            logger.info(`[登录] ${result.description}`);
        } else {
            logger.warn(`[登录] ${result.description}`);
        }
    } catch (error) {
        logger.error(`[登录] ${error}`);
    }
    if (token === undefined) return;
    try {
        let result = await daily(randomTemperature, token);
        if (result.code == 1) {
            logger.info(`[每日填报] 已提交${randomTemperature}℃`);
            process.exitCode = 0;
        } else {
            logger.warn(`[每日填报] ${result.description}`);
        }
    } catch (error) {
        logger.error(`[每日填报] ${error}`);
    }
}

run();
