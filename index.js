'use strict';
var file = require('./lib/file');
var fs = require('fs');
var promise = require('bluebird');
var path = require('path');


module.exports = {
    transMd: file.transMd,
    writeJs: file.writeJs,
    createMd: file.createMd,

    all: function (mdfile, jsfile) {

        if(!jsfile) {
            jsfile = './js_file/';
            if (!fs.existsSync(jsfile)) {
                fs.mkdirSync(jsfile);
            }
        }

        let arr = [];
        
        
           if(/[\w\W]+\.md$/.test(mdfile)) {
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
                for(let i of result) {
                    let fileName = path.basename(i[1], '.md');
                    let url = jsfile + fileName + '.js';
                    file.writeJs(url, i[0]);
                }
            })
    }
};
