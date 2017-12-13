const fs = require('fs-extra'),
    path = require('path'),
    config = require('./config'),
    md2Object = require('../util/md2Object'),
    mdArray = require('../util/mdArray'),
    codeTemplate = require('../file/codeTemplate');

module.exports = async function (md_dir, mock_dir) {

    try {
        if (!md_dir){
            md_dir = config.md_dir;
            await fs.ensureDir(md_dir);
        }
        if (!mock_dir) mock_dir = config.mock_dir;

        await fs.ensureDir(mock_dir);

        let mdItems = mdArray(md_dir);

        for (let md of mdItems) {

            try {

                //md文件名
                let tempDir = md;
                let ApiItem = md2Object(tempDir).item;

                for (let apiObject of ApiItem) {

                    //生成mock数据
                    let mockUrl = path.join(mock_dir, `${apiObject.url[2]}_${apiObject.url[3]}.do.js`);
                    let mockJson = codeTemplate.mock(apiObject.mock);
                    fs.writeFileSync(mockUrl, jsonTransform(mockJson));
                    console.log(' js 代码生成成功!  --->  ' + mockUrl);

                }//循环api

            } catch (e) {
                console.error(`${md_dir} 有错误，请确保API文档正确✅` + e);
                break;
            }
        }//for循环遍历md文件
    } catch (e) {
        console.error('生成js代码过程中出错');
    }
};
//mockJSON数据中英文,: 切换
var jsonTransform = function (json) {
    return json
        .replace(/[：]/g, ':')
        .replace(/[，]/g, ',')
        .replace(/[【]/g, '[')
        .replace(/[】]/g, ']');
};
