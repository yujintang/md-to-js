'use strict';

module.exports = {

    action_template: function (describe, codeTemp) {
        return `/**
 * 文件描述：${describe}
 *
 * 创建时间: ${(new Date()).toLocaleDateString()}
 */
"use strict";

module.exports = function (dbo) {

    const _ = require('lodash'),
        path = require('path'),
        config = global.config,
        config_path = config.path,
        Result = require('kml-express-stage-lib').Result,
        logger = global.loggers.system,
        verication = new (require('../../modules/verication'))(dbo),
        LIMIT = 20, OFFSET = 0
        ;
        
        ${codeTemp}
};`
    },

    api_template: function (api, body, paramDetail, tempBody, params) {
        let method = api.method.replace(/(\w)/,function(v){return v.toUpperCase()});
        return `
    /**
     * ${api.name}
     * @param req
     * @param res
     * @param db
     * @returns {Result}
     */
    this.${api.router}${method} = async function (req, res, db) {
        try {
            let session = req.session, active_user = session.active_user, user_id = active_user.user_id, default_params = req.default_params;
            //获取数据
            let {${params}} = req.${body};
            //必填选项检查
            verication.params_valid(req.${body}, ['id']);
            // 模型导入
            let [A] = verication.entityDb('a');
        
            //代码逻辑区域
            let result = await A.findById(id);
            
            
        } catch (e) {
            return new Result(Result.ERROR, '失败', e.message)
        }
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
url = http://www.test.com/test/orderSearch
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
        data = data || '{}';
        return `"use strict"
module.exports = {
    ret: "OK",
    msg: "成功!",
    content: ${data}
};
`
    }


};