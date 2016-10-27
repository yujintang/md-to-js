'use strict';
var file = require('./lib/file');
var fs = require('fs');
var promise = require('bluebird');
var path = require('path');

module.exports = {
    createMd: file.createMd,

    all: function (mdfile, js_file) {
        
        if (!js_file) {
            let output = path.resolve(process.cwd(), './output/');
            let mock_file = path.resolve(process.cwd(), './output/js_file/mock');
            js_file = path.resolve(process.cwd(), './output/js_file');

            if (!fs.existsSync(output)) {
                fs.mkdirSync(output);
            }

            if (!fs.existsSync(js_file)) {
                fs.mkdirSync(js_file);
            }

            if (!fs.existsSync(mock_file)) {
                fs.mkdirSync(mock_file);
            }
        }

        if(!fs.existsSync(js_file)) {
            console.log('js_file路径不存在');
            process.exit(1);
        }
        if(!fs.existsSync(mdfile)) {
            console.log('mdfile路径不存在');
            process.exit(1);
        }

        let arr = [];


        if (/[\w\W]+\.md$/.test(mdfile)) {
            arr.push(file.transMd(mdfile));
        } else {
            let redDir = fs.readdirSync(mdfile);
            for (let i of redDir) {
                if (/[\w\W]+\.md/.test(i)) {
                    let url = path.join(mdfile, i);
                    arr.push(file.transMd(url));
                }
            }
        }
        
        return promise.all(arr)
            .then(function (result) {
                for (let i of result) {
                    let fileName = path.basename(i[1], '.md');
                    let url = path.join(js_file, fileName + '.js');
                    file.writeJs(url, i[0]);
                }
            })
    }
};
