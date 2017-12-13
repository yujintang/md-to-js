const fs = require('fs-extra'),
    path = require('path'),
    config = require('./config');

module.exports = async function (dist) {
    try {
        let src = path.join(__dirname, '../file/test.md');

        dist || (dist = config.md_file);

        if (path.extname(dist) !== '.md') {
            throw new Error(dist + '  格式错误,必须为 .md 的文件');
        }

        await fs.ensureFile(dist);
        await fs.copy(src, dist);
        console.log('MD文件写入成功!  --->  ' + dist);
    } catch (e) {

        console.error('错误!  ---> ' + e.message);
    }
}