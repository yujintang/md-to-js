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

    api_template: function (api, body, paramDetail, allParams, mustParams) {
        let method = api.method.replace(/(\w)/,function(v){return v.toUpperCase()});
        return `
    /**
     * ${api.name}
     */
    this.${api.router}${method} = async(req) => {
        try {
            //let session = req.session, active_user = session.active_user, user_id = active_user.user_id, default_params = req.default_params;
            //获取数据
            let params = req.${body};
            let {${allParams}} = params;
            //必填选项检查
            verication.params_valid(params, [${mustParams}]);
            // 模型导入
            let [] = verication.entityDb();
        
            //代码逻辑区域
            let res = {};
            res.xx = await A.findById(id);
            
            return new Result(Result.OK, '成功', void 0, result);
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
# 1.api1
- 说明性文字

${code}
url = http://www.test.com/b/corp/api1
method = GET
${code}

**传入参数**

| name | code | type | must | note |
| ---- | ---- | ---- | ---- | ---- |
|  啊 |  a |  String  | true | 订单创建的名字 |
|  吧 |  b |  String  | false |  |
|  出 |  c |  String  | true |  |
|  的 |  d |  String  | false |  |
|  额 |  e |  String  | true |  |


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

# 2.api2
- 说明性文字

${code}
url = http://www.test.com/b/corp/api2
method = GET
${code}

**传入参数**

| name | code | type | must | note |
| ---- | ---- | ---- | ---- | ---- |
|  啊 |  a |  String  | true | 订单创建的名字 |
|  吧 |  b |  String  | false |  |
|  出 |  c |  String  | true |  |
|  的 |  d |  String  | false |  |
|  额 |  e |  String  | true |  |


**输出内容**

${code}json
{
  "order_name": "ssss"
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