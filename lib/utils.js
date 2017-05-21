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
        po = global.po,
        config = global.config,
        response = require('kml-express-stage-lib/lib/response'),
        crypto_utils = require('kml-crypto-utils'),
        logger = global.loggers.system,
        Promise = require('bluebird'),
        verication = new (require('../../modules/verication'))(dbo),
        LIMIT = 20, OFFSET = 0;
        
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
        let myRes = {};
        try {
            /*let session = req.session, active_user = session.active_user, 
                my_user_id = active_user.user.user_id, 
                my_plat_id = active_user.plat.plat_id, 
                my_corp_id = active_user.corp.corp_id,
                default_params = req.default_params; */
            
            //获取数据
            let params = req.${body};
            let {${allParams}} = params;
            
            //必填选项检查
            verication.params_valid(params, [${mustParams}]);
            
            // 模型导入
            let [] = po.import(dbo, []);
            
            // 定义事务
            //myRes.t1 = await dbo.transaction();
        
            //代码逻辑区域
            //myRes.xx = await A.findById(id);
            
            let result = {};
            
            myRes.t1 && myRes.t1.commit();
            return response.OK('成功!', result);
        } catch (e) {
            myRes.t1 && myRes.t1.rollback();
            return response.Error('失败!', e.message);
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
  "ret": "OK"
}
${code}

**输出说明**

| name | code | type | must | note |
| ---- | ---- | ---- | ---- | ---- |
|      |      |      |      |      |
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
|      |      |      |      |      |

      
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