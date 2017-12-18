[TOC]
## 1.POST测试，saas-back登录为例

##### Note
- 请严格按照模版书写✍️API
- 如需多份接口，请复制模版，然后在模版上修改，请勿修改模版结构
- postman上，请将saas_url 设置 为对应地址

##### Url
```http
{{saas_url}}/b/auth/syslogin
```

##### Method
```javascript
POST
```

##### Request
| name |     code     |  type  | must |   note   |
| :--: | :----------: | :----: | :--: | :------: |
| 用户名  |   userCode   | string | true |          |
|  密码  | userPassword | string | true | 密码为🔐的内容 |

##### Mock
```json
{
  "content":{},
  "ret":"OK",
  "msg":"成功!"
}
```
##### MockUrl
```http
http://iot.kmlab.com
```

##### Response
| name |  code   |  type  | must | note |
| :--: | :-----: | :----: | :--: | :--: |
| 返回数据 | content | Object | true |      |
| 是否成功 |   ret   | String | true |      |
| 提示信息 |   msg   | String | true |      |

## 2.GET测试，客户显示列表为例

##### Note
- 这是一个GET接口

##### Url
```http
{{test_url}}/b/corp/corpList
```

##### Method
```javascript
GET
```

##### Request
| name |  code  |  type  | must  |     note     |
| :--: | :----: | :----: | :---: | :----------: |
| 模糊查询 | search | string | false | 客户编号、客户名模糊查询 |

##### Mock
```json
{
  "content":{},
  "ret":"OK",
  "msg":"成功!"
}
```
##### MockUrl
```http
http://iot.kmlab.com
```

##### Response
| name |  code   |  type  | must  | note |
| :--: | :-----: | :----: | :---: | :--: |
| 返回数据 | content | Object | true  |      |
| 是否成功 |   ret   | String | true  |      |
| 提示信息 |   msg   | String | false |      |

