'use strict';
var fs = require('fs');
var path = require('path');
var utils = require('./utils');
var LineByLineReader = require('line-by-line');
var promise = require('bluebird');

module.exports = {

    transMd: function (file) {

        return new promise(function (resolve) {
            let lr = new LineByLineReader(file, { encoding: 'utf8', skipEmptyLines: true });

            let allArr = []; //存放参数地方
            let temp = {
                name: '',
                router: '',
                method: '',
                reqData: [],
                reqType: [],
                reqMust: [],
                reqName: []
            };

            var count = 0; //记录匹配次数,用来过滤无用的 #
            var flag1 = false;  //过滤表头
            var flag2 = true;  //过滤输出

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
                            reqName: []
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
                }

                //获取方法
                let reg3 = /(?:method *= *([\w\W]*))/;
                if (reg3.test(line)) {
                    count++;
                    temp.method = reg3.exec(line)[1];
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

                //过滤输出
                let reg5 = /(输出说明)/;
                if (reg5.test(line)) {
                    flag2 = false;
                }

            });

            lr.on('end', function () {
                if(count >=2) {
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
            if (i.method == 'Post') {
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
                    let everyParamT = ''
                    if ((forType[j] == 'Array')) {
                        everyParamT = `!util.isArray(${forData[j]})`;
                    } else if (forType[j] == 'Object') {
                        everyParamT = `!util.isObject(${forData[j]})`;
                    } else {
                        everyParamT = `!${forData[j]}`;
                    }
                    tempBody = tempBody + `
            || ${everyParamT}`;
                }

                let everyParamD = '';

                let regExp = /(f|否|非|不|n)/i;
                if (regExp.test(forMust[j])) {  //false
                    if(forData[j]) {
                        everyParamD = `let ${forData[j]} = body.${forData[j]} || new ${forType[j]};     // 必填: ${forMust[j]};  含义: ${forName[j]}`;
                    }
                } else {  //true
                    if(forData[j]) {
                        everyParamD = `let ${forData[j]} = body.${forData[j]};     // 必填: ${forMust[j]};  含义: ${forName[j]}`;
                    }
                }
                paramDetail = paramDetail + `
        ${everyParamD} `;
            }

            //每个api接口的代码
            let tempCode = utils.api_template(i, body, paramDetail, tempBody);

            codeTemp = codeTemp + tempCode;

        }//for

        code = code + utils.action_template(describe, codeTemp);

        fs.writeFile(paths, code, function (err) {
            if (err) {
                console.log(err);
                process.exit(1);
            } else {
                console.log(paths + '已经生成');
            }
        })
    },

    createMd: function (url) {

        if(!/[\w\W]+\.md$/.test(url)) {
            console.log('参数必须为 .md 的文件');
            process.exit(1);
        }

        fs.writeFile(url, utils.md_template(), function (err) {
            if (err) {
                console.log(err);
                process.exit(1);
            } else {
                console.log(url + '文件已经生成成功!');
            }
        })

    }

};
