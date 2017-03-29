# 使用markdown 生成js代码

## **shell用法:**

## 公司内部专用

下载:
```shell
npm install md-to-js
cd md-to-js
npm link
```

## 使用bin下脚本自动生成
- 生成的内容放在服务运行目录下的output目录下
- 生成output目录结构
```
├── output
│   ├── js_file                     #生成js文件位置
│   │   ├── demo.js
│   │   └── mock                    #生成mock数据位置
│   │       ├── api1.js
│   │       ├── api2.js
│   │       └── orderSearch.js
│   └── md_file                     #存放markdown文件位置
│       └── demo.md
```

###  生成md规范示例文件 demo.md
```shell
 createMd  
```
- 该文件生成于./output/md_file/文件夹下

###  生成mock数据以及js代码 
```shell
md2js
```
- 请将要生成的API markdown文件存放于 ./output/md_file/目录下
- API 对应生成的js文件与 mock 文件分别位于 ./output/下的对应文件夹内


## **js用法**

### 生成md规范示例文件
```javascript
let mj = require('md-to-js');
mj.createMd('./demo.md');
```
- 在当前目录下生成demo.md markdown文件


### md直接生成js文件
```javascript
let mj = require('md-to-js');
mj.all(mdfile, jsfile);
```
- mdfile 为存放API的文件或文件夹 
- jsfile 选填参数，存放生成的js文件存放的位置，必须为文件夹， 默认存放于 ./output/js_file/ 目录下

