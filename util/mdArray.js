"use strict";

const path = require('path'),
    fs = require('fs-extra');

/**
 * 将文件下的md文件路径列处理
 * @param md_dir md文件夹
 * @returns {Array} md文件路径数组
 */
module.exports = function (md_dir) {

    let mdItems = []; //存放md路径

    try {
        let stat = fs.lstatSync(md_dir);
        if (stat.isFile()) {
            if (path.extname(md_dir) !== '.md') {
                throw new Error(md_dir + '  格式错误,必须为 .md 的文件');
            }
            mdItems.push(path.join(md_dir))
        } else if (stat.isDirectory()) {
            fs.readdirSync(md_dir).forEach(md => {
                if (path.extname(md) === '.md' && md.toLowerCase() !== 'readme.md') {
                    mdItems.push(path.join(md_dir, md))
                }
            })
        }
    } catch (e) {
        console.error(`${md_dir} 有错误，请保证参数有效！` + e);
        return mdItems
    }

    return mdItems;
};