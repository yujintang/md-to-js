"use strict";

const mdconf = require('./mdconf'),
    _ = require('lodash'),
    path = require('path'),
    fs = require('fs-extra');

module.exports = function (js_file) {

    let mdContent = fs.readFileSync(js_file, 'utf8');
    let mdParse = mdconf(mdContent);

    let result = {item:[]};

    Object.keys(mdParse).forEach((key) => {
        let apiObject = mdParse[key];

        let tempApi = {
            name: key,
            url: apiObject.url[0].split(path.sep),
            method: apiObject.method[0].substr(0, 1).toUpperCase() + apiObject.method[0].substr(1).toLowerCase(),
            mock: apiObject.mock[0],
            mockUrl: apiObject.mockurl[0],
            note: _.map(apiObject.note, (v, id) => {
                let number = id + 1;
                return `(${number}): ${v}`;
            }).join(`;\t`),
            request: apiObject.request,
            response: apiObject.response
        };
        tempApi.methodTrans = tempApi.method === 'Get' ? 'query' : 'body';

        //将单个API放入item
        result.item.push(tempApi);
    });

    return result;
}
;