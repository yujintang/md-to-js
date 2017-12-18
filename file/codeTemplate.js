"use strict"

module.exports = {

    //js头文件模版
    heading: function (option) {
        return `
/**
 * @module ${option.name}
 * @author itomix
 * @description 
${option.describe} 
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
        itomix = require('itomix'),
        LIMIT = 20, OFFSET = 0;
        
    ${option.codeTemp}
};
`
    },

    //js单个api模版
    action: function (option) {
        return `
    /**
     * ${option.name}
     * @see {@link ${option.mockUrl}|Mock数据}
     * @param {Object} req - 请求参数
${option.paramsTags}
     * @param {Object} res - 返回参数
${option.resParamsTags}
     */
    this.${option.url[3]}${option.method} = async (req, res) => {
        const myRes = {};
        try {
            let session = req.session,
                my_user_id = _.get(session, 'active_user.user_id'),
                my_plat_id = _.get(session, 'plat.plat_id'),
                my_corp_id = _.get(session, 'corp.corp_id'),
                default_params = req.default_params;
            
            //获取数据
            let params = req.${option.methodTrans};
            let {${option.params}} = params;
            
            //必填选项检查
            itomix.params_valid(params, [${option.mustParams}]);
            
            // 模型导入
            let [] = po.import(dbo, []);
            
            // 定义事务
            //myRes.t1 = await dbo.transaction();
        
            //代码逻辑区域
            //todo ${option.url[3]} 代码逻辑
            
            let result = {};
            
            myRes.t1 && myRes.t1.commit();
            return response.Ok('成功!', result);
        
        } catch (e) {
        
            myRes.t1 && myRes.t1.rollback();
            return response.Error('失败!', e.message);
        }
    };
    `
    },


    //mock数据模版
    mock: function (mockJson) {
        return `
"use strict";

module.exports = ${mockJson};
        `;
    },
};