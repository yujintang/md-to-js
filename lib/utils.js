'use strict';

module.exports = {

    action_template: function (describe, codeTemp) {
        return `/**
 * 文件描述：${describe}
 * 开发者：
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * 创建时间: ${(new Date()).toLocaleDateString()}
 */

"use strict";

module.exports = function (dbo) {
    
    //api公共模块
    const _ = require('lodash'),
        path = require('path'),
        util = require('util'),
        config_path = global.config.path,
        MODULES_PATH = config_path.MODULES_PATH,
        ENTITIES_PATH = config_path.ENTITIES_PATH,
        Result = require('../../lib/result'),
        logger = global.loggers.system,
        crypto_utils = require('../../lib/crypto-utils');
        
        ${codeTemp}
}`
    },

    api_template: function (api, body, paramDetail, tempBody) {
        return `
    /**
     * ${api.name}
     * @param req
     * @param res
     * @param db
     * @returns {Result}
     */
    this.${api.router}${api.method} = function (req, res, db) {
        
        //前端发来参数
        let body = req.${body};
        ${paramDetail}
    
        //判断传入参数是否正确
        if (!body ${tempBody}) {
            return new Result(Result.ERROR, '参数有错误');
        }
    
        //代码逻辑区域
    
    
    };
        
        `
    }


};