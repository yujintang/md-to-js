'use strict';
var file = require('./lib/file');
var fs = require('fs');
var promise = require('bluebird');
var path = require('path');


module.exports = {
    transMd: file.transMd,
    writeJs: file.writeJs,

    all: function (mdfile, jsfile) {

        let mdStat = fs.lstatSync(mdfile);
        let jsStat = fs.lstatSync(jsfile);

        if(!mdStat.isDirectory() || !jsStat.isDirectory()) {
            console.log('参数必须为文件夹');
            process.exit(1);
        }

        let redDir = fs.readdirSync(mdfile);
        let arr = [];
        for (let i of redDir) {
            let url = path.join(mdfile, i);
            arr.push(file.transMd(url));
        }

        return promise.all(arr)
            .then(function (result) {
                for(let i of result) {
                    let fileName = path.basename(i[1], '.md');
                    let url = jsfile + fileName + '.js';
                    file.writeJs(url, i[0]);
                }
            })
    }
};
