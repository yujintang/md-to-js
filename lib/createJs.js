const fs = require('fs-extra'),
    path = require('path'),
    config = require('./config'),
    md2Object = require('../util/md2Object'),
    mdArray = require('../util/mdArray'),
    codeTemplate = require('../file/codeTemplate'),
    regexpObj = require('../util/myRegexp');

module.exports = async function (md_dir, js_dir) {

    try {
        if (!md_dir){
            md_dir = config.md_dir;
            await fs.ensureDir(md_dir);
        }
        if (!js_dir) js_dir = config.js_dir;

        await fs.ensureDir(js_dir);

        let mdItems = mdArray(md_dir);

        for (let md of mdItems) {

            try {

                //js文件名
                let mdBasename = path.basename(md, '.md');
                let jsFile = path.join(js_dir, mdBasename + '.js');

                //md文件名
                let tempDir = md;
                let ApiItem = md2Object(tempDir).item;

                let actionOption = {};
                actionOption.name = mdBasename;
                actionOption.describe = [];
                actionOption.codeTemp = [];

                for (let apiObject of ApiItem) {

                    //临时模版api对象参数
                    apiObject.params = [];
                    apiObject.mustParams = [];
                    apiObject.paramsTags = [];
                    apiObject.resParamsTags = [];
                    for (let req of apiObject.request) {

                        req.type = req.type.toLowerCase() || 'string';
                        apiObject.params.push(req.code);
                        if (regexpObj.must.test(req.must)) {
                            apiObject.mustParams.push(`"${req.code}"`);
                            req.code = `req.${req.code}`;
                        }else {
                            req.code = `[req.${req.code}]`;
                        }
                        apiObject.paramsTags.push(`\t * @param {${req.type}} ${req.code} - ${req.note}`)
                    }
                    for (let res of apiObject.response) {

                        res.type = res.type.toLowerCase() || 'string';
                        apiObject.params.push(res.code);
                        if (regexpObj.must.test(res.must)) {
                            apiObject.mustParams.push(`"${res.code}"`);
                            res.code = `res.${res.code}`;
                        }else {
                            res.code = `[res.${res.code}]`;
                        }
                        apiObject.resParamsTags.push(`\t * @param {${res.type}} ${res.code} - ${res.note}`)
                    }
                    apiObject.paramsTags = apiObject.paramsTags.join(`\n`);
                    apiObject.resParamsTags = apiObject.resParamsTags.join(`\n`);
                    apiObject.params = apiObject.params.join(', ');
                    apiObject.mustParams = apiObject.mustParams.join(', ');

                    //生成单个API模版
                    let apiStr = codeTemplate.action(apiObject);

                    actionOption.describe.push(` * \t ${apiObject.name} (${apiObject.url[3]}${apiObject.method}); `);
                    actionOption.codeTemp.push(apiStr);

                }//循环api

                actionOption.describe = actionOption.describe.join(`\n`);
                actionOption.codeTemp = actionOption.codeTemp.join(`\n`);

                //
                let mdString = codeTemplate.heading(actionOption);

                //写入文件
                fs.writeFileSync(jsFile, mdString);
                console.log(' js 代码生成成功!  --->  ' + jsFile);

            } catch (e) {
                console.error(`${md} 有错误，请确保API文档正确✅` + e);
                break;
            }
        }//for循环遍历md文件
    } catch (e) {
        console.error('生成js代码过程中出错' + e);
    }
};