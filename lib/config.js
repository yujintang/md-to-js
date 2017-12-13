"use strict"

const path = require('path');

let dirObject = {
    js_dir: path.resolve(process.cwd(), './output/js_file/'),
    json_dir: path.resolve(process.cwd(), './output/json_file/'),
    mock_dir: path.resolve(process.cwd(), './output/mock_file/'),
    md_dir: path.resolve(process.cwd(), './output/md_file/'),
    md_file: path.resolve(process.cwd(), './output/md_file/test.md')
};


module.exports = dirObject;