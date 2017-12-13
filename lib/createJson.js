const fs = require('fs-extra'),
    path = require('path'),
    crypto = require('crypto'),
    config = require('./config'),
    md2Object = require('../util/md2Object'),
    mdArray = require('../util/mdArray'),
    regexpObj = require('../util/myRegexp');

module.exports = async function (md_dir, json_dir) {

    try {
        if (!md_dir){
            md_dir = config.md_dir;
            await fs.ensureDir(md_dir);
        }
        if (!json_dir) json_dir = config.json_dir;

        await fs.ensureDir(json_dir);

        //js文件名
        let jsonFile = path.join(json_dir, 'md2js.createJson.test.json');

        //postman_collection
        let postman = {
            info: {
                name: 'test',
                _postman_id: crypto.randomBytes(16).toString('hex'),
                schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
            },
            item: []
        };

        let mdItems = mdArray(md_dir);

        for (let md of mdItems) {

            try {

                let item = {
                    name: path.basename(md, '.md') + '_action',
                    description: '',
                    item: []
                };

                //md文件名
                let tempDir = md;
                let ApiItem = md2Object(tempDir).item;


                for (let apiObject of ApiItem) {

                    let itemApi = {
                        name: apiObject.name,
                        request: {
                            method: '',
                            header: [],
                            body: {
                                mode: "raw",
                                raw: {}
                            },
                            url: {
                                raw: '',
                                host: [],
                                path: [],
                                query: []
                            },
                            description: ''
                        },
                        response: []
                    };

                    let urlSep = apiObject.url;
                    itemApi.request.url = {
                        raw: apiObject.url.join('/'),
                        host: urlSep[0],
                        path: urlSep.shift() && urlSep,
                        query: []
                    };

                    itemApi.request.description = JSON.stringify(apiObject.note);
                    itemApi.request.method = apiObject.method.toUpperCase();
                    if (itemApi.request.method === 'POST') {
                        itemApi.request.header.push({
                            "key": "Content-Type",
                            "value": "application/json"
                        })
                    }
                    for (let req of apiObject.request) {

                        if (itemApi.request.method === 'POST') {
                            itemApi.request.body.raw[req.code] = ''
                        } else {
                            itemApi.request.url.query.push({
                                key: req.code,
                                value: '',
                                equals: false,
                                disabled: regexpObj.must.test(req.must)
                            })
                        }
                    }

                    itemApi.request.body.raw = JSON.stringify(itemApi.request.body.raw)

                    item.item.push(itemApi)

                }//循环api

                postman.item.push(item);

            } catch (e) {
                console.error(`${md_dir} 有错误，请确保API文档正确✅ ` + e);
                break;
            }
        }//for循环遍历md文件

        //写入文件
        fs.writeFileSync(jsonFile, JSON.stringify(postman));
        console.log(' json 代码生成成功!  --->  ' + jsonFile);
    } catch (e) {
        console.error('生成json代码过程中出错');
    }

};