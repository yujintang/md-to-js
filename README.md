# 使用markdown 生成js代码

## 公司内部专用

下载:
```shell
npm install md-to-js
cd md-to-js
npm link
```

###  命令行模式
```shell
md2js --help
```

## js用法

### 生成md规范示例文件
```javascript
let md2js = require('md-to-js');

md2js.createMd(md_file);
md2js.createJs(md_file, js_file);
md2js.createJson(md_file, json_file);
md2js.createMock(md_file, mock_file);
```
- 参数都为可选，默认生成与使用 ./output/文件夹下内容

