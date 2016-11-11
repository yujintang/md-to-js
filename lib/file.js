'use strict';
var fs = require('fs');
var path = require('path');
var utils = require('./utils');
var LineByLineReader = require('line-by-line');
var promise = require('bluebird');
var chalk = require('chalk');

module.exports = {

    transMd: function (file) {

        return new promise(function (resolve) {
            let lr = new LineByLineReader(file, {encoding: 'utf8', skipEmptyLines: true});

            let allArr = []; //存放参数地方
            let temp = {
                name: '',
                router: '',
                method: '',
                reqData: [],
                reqType: [],
                reqMust: [],
                reqName: [],
                mockUrl: '',
                mockDate: ''
            };

            var count = 0; //记录匹配次数,用来过滤无用的 #
            var flag1 = false;  //过滤表头
            var flag2 = true;  //过滤输出
            var mockOpen = false;  //开始读取mock数据
            var mockStart = false;  //```准备

            lr.on('error', function (err) {
                // 'err' contains error object
            });

            lr.on('line', function (line) {

                //获取标题
                let reg1 = /(?:#+ *([\w\W]*))/;
                if (reg1.test(line)) {
                    if (count < 2) {
                    } else {
                        allArr.push(temp);
                        //初始化
                        temp = {
                            name: '',
                            router: '',
                            method: '',
                            reqData: [],
                            reqType: [],
                            reqMust: [],
                            reqName: [],
                            mockUrl: '',
                            mockDate: ''
                        };
                        flag1 = false;
                        flag2 = true;
                        count = 0;
                    }
                    temp.name = reg1.exec(line)[1];
                }

                //获取名字
                let reg2 = /(?:url *= *[\w\W]*_([^_]+).do[\w\W]*)/;
                if (reg2.test(line)) {
                    count++;
                    temp.router = reg2.exec(line)[1];
                    temp.mockUrl = path.basename(/(?:url *= *([\w\W]*).do)/.exec(line)[1]) + '.do.js';
                }

                //获取方法
                let reg3 = /(?:method *= *([\w\W]*))/;
                if (reg3.test(line)) {
                    count++;
                    temp.method = (reg3.exec(line)[1]).toLowerCase();
                }

                //获取参数
                let reg4 = /(?:\|? * ([^-\|]+) *\|)/;
                if (reg4.test(line)) {
                    if (flag1 && flag2) {
                        reg4 = /(?:\|? * ([^-\|]+)[ ]*\|)/g;  //防止reg3记录正则次数
                        temp.reqName.push(reg4.exec(line)[1].replace(/(^\s*)|(\s*$)/g, ''));
                        temp.reqData.push(reg4.exec(line)[1].replace(/(^\s*)|(\s*$)/g, ''));
                        temp.reqType.push(reg4.exec(line)[1].replace(/(^\s*)|(\s*$)/g, ''));
                        temp.reqMust.push(reg4.exec(line)[1].replace(/(^\s*)|(\s*$)/g, ''));
                        count++;
                    } else {
                        flag1 = true;
                    }

                }

                //mock 数据
                let regMKOpen = /(输出内容)/;
                if (regMKOpen.test(line)) {
                    mockOpen = true;
                }

                //mock 读取
                let regMkStart = /^\s*```*/;
                if (regMkStart.test(line)) {
                    if (mockOpen) {
                        if (mockStart) {
                            mockOpen = false;
                            mockStart = false;
                        } else {
                            mockStart = true;
                        }
                    }
                }

                //mock 填入
                if (mockOpen && mockStart && !/^\s*```*/.test(line)) {
                    temp.mockDate = temp.mockDate + `${line}
                    `;
                }

                //过滤输出
                let reg5 = /(输出说明)/;
                if (reg5.test(line)) {
                    flag2 = false;
                }

            });

            lr.on('end', function () {
                if (count >= 2) {
                    allArr.push(temp);
                }
                resolve([allArr, file]);
            });
        })
    },


    writeJs: function (file, allArr) {

        var paths = path.resolve(file);
        let code = ''; //存放生成api的地方
        let codeTemp = ''; //临时存放api的地方
        let describe = '';  //开发描述说明
        //循环处理每一个api内容
        for (let i of allArr) {

            describe = describe + `${i.name}, `;

            //定义字符串取法
            let body = 'query';
            if (i.method.toUpperCase() == 'POST') {
                body = 'body';
            }
            //参数由数组变为字符串
            //let paramArr = i.reqData.join(', ');

            //参数判断处理
            let paramDetail = '';
            //每个参数判断
            let tempBody = '';
            let forData = i.reqData;
            let forType = i.reqType;
            let forMust = i.reqMust;
            let forName = i.reqName;
            for (let j in forData) {
                if (forMust[j]) {
                    //let everyParamT = `${forData[j]}.constructor == ${forType[j]}`;
                    let everyParamT = '';
                    if ((forType[j].toLowerCase() == 'array')) {
                        everyParamT = `!_.isArray(${forData[j]})`;
                    } else if (forType[j].toLowerCase() == 'object') {
                        everyParamT = `!_.isObject(${forData[j]})`;
                    } else {
                        everyParamT = `!${forData[j]}`;
                    }
                    tempBody = tempBody + `
            || ${everyParamT}`;
                }

                let everyParamD = '';

                let regExp = /(f|否|非|不|n)/i;
                if (regExp.test(forMust[j])) {  //false
                    if (forData[j]) {
                        everyParamD = `let ${forData[j]} = params.${forData[j]} || void 0;   //选填`;
                    }
                } else {  //true
                    if (forData[j]) {
                        everyParamD = `let ${forData[j]} = params.${forData[j]};`;
                    }
                }
                paramDetail = paramDetail + `
        ${everyParamD} `;
            }

            //每个api接口的代码
            let tempCode = utils.api_template(i, body, paramDetail, tempBody);

            codeTemp = codeTemp + tempCode;
            
            let mockUrl = path.resolve(paths, '../mock/');
            if (!fs.existsSync(mockUrl)) {
                fs.mkdirSync(mockUrl);
            }

            mockUrl = path.resolve(mockUrl, i.mockUrl);
            
            fs.writeFile(mockUrl, utils.mock_template(i.mockDate), function (err, data) {
                if(err) {
                    console.log('错误!  --->  ' + chalk.red(i.name + '  mock数据生成错误'));
                    process.exit(1);
                }
                console.log('mock数据生成成功!  --->  ' + chalk.cyan(mockUrl));
            });

        }//for

        code = code + utils.action_template(describe, codeTemp);

        fs.writeFile(paths, code, function (err) {
            if (err) {
                console.log('错误!  --->  ' + chalk.red(paths + '  写入过程出错'));
                process.exit(1);
            } else {
                console.log(' js 代码生成成功!  --->  ' + chalk.green(paths));
            }
        })
    },

    createMd: function (dir) {

        if (!/[\w\W]+\.md$/.test(dir)) {
            console.log('错误!  --->  ' + chalk.red(dir + '  格式错误,必须为 .md 的文件'));
            process.exit(1);
        }

        dir = path.resolve(dir);
        fs.writeFile(dir, utils.md_template(), function (err) {
            if (err) {
                console.log('错误!  --->  ' + chalk.red(paths + '  写入过程出错'));
                process.exit(1);
            } else {
                console.log('MD文件生成成功!  --->  ' + chalk.magenta(dir));
            }
        })

    }

};
