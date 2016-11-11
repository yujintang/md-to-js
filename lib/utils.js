'use strict';

module.exports = {

    action_template: function (describe, codeTemp) {
        return `/**
 * 文件描述：${describe}
 *
 * 创建时间: ${(new Date()).toLocaleDateString()}
 * 开发者：
 * 审阅者：
 * 优化建议：
 */

"use strict";

module.exports = function (dbo) {
    
    //api公共模块
    const _ = require('lodash'),
        path = require('path'),
        Promise = require('bluebird'),
        config_path = global.config.path,
        MODULES_PATH = config_path.MODULES_PATH,
        ENTITIES_PATH = config_path.ENTITIES_PATH,
        Result = require('../../lib/result'),
        logger = global.loggers.system,
        crypto_utils = require('../../lib/crypto-utils'),
        dbModel = function (dbo, ENTITIES_PATH) {
            return function model() {
                return _.map(_.toArray(arguments), value => dbo.import(path.resolve(ENTITIES_PATH, value)))
            }
        },
        entityDb = dbModel(dbo, ENTITIES_PATH);
        
        ${codeTemp}
};`
    },

    api_template: function (api, body, paramDetail, tempBody) {
        let method = api.method.replace(/(\w)/,function(v){return v.toUpperCase()});
        return `
    /**
     * ${api.name}
     * @param req
     * @param res
     * @param db
     * @returns {Result}
     */
    this.${api.router}${method} = function (req, res, db) {
        
        //接收参数
        let params = req.${body};
        ${paramDetail}
    
        //参数判断
        if (!params ${tempBody}) {
            return new Result(Result.ERROR, '参数有错误');
        }
    
        //模型导入
        let [One, Two] = entityDb('one', 'two');
        
        //代码逻辑区域
    
    
    
    
    };
        
        `
    },

    md_template: function () {
        var code = '```';
        return `**目录**
[TOC]
# 1.api名
- 说明性文字

${code}
url = http://www.test.com/test_orderSearch.do
method = GET
${code}

**传入参数**

| name | code | type | must | note |
| ---- | ---- | ---- | ---- | ---- |
|  订单ID |  order_id |  String  | true | 订单唯一标识符  |

**输出内容**

${code}json
{
  "order_name": "花销账单"
}
${code}

**输出说明**

| name | code | type | must | note |
| ---- | ---- | ---- | ---- | ---- |
|  订单名 |  order_name |  String  | true | 订单创建的名字 |


        
`
    },

    mock_template: function (data) {
        return `"use strict"
module.exports = {
    ret: "OK",
    msg: "成功!",
    content: ${data}
};
`
    }


};