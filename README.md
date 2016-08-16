# 使用markdown 生成js代码

## 用法:

下载:
````
npm install md-to-js --save
````

## api:

### md生成数组对象
````
mj.transMd(url);
````

### 数组生成js文件
````
mj.writeJs(url, arr);
````

### md直接生成js文件
````
mj.all(mdfile, jsfile);
````
- mdfile 参数可以为文件夹,也可以为.md 文件 jsfile 必须为文件夹
- jsfile 参数可以忽略,默认添加在'./js_file/' 下

###  生成md文件格式
````
mj.createMd(url);
````
- url 参数必须为 .md 的文件
