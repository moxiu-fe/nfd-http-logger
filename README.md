##  nfd-httpLogger
兼容express@4.x,依赖于bady-parser。

安装：
```
$ npm install nfd-httpLogger --save
```

使用：
```
var express = require('express'),
    bodyParser = require('body-parser'),
    httpLogger = require('nfd-httpLogger');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));

/*
 * 依赖于bady-parser
 * 返回一个记录请求日志的中间件
 * 默认记录所有请求地址的请求日志。
 * 你也可以传入一个匹配特定请求地址的正则表达式作为参数,如：
 * app.use(httpLogger(/\.htm$/)); // 只记录请求地址以.htm结尾的请求日志
 */
app.use(httpLogger());
```
此时，请求日志将会输出至控制台,将会记录一下http信息：remoteAddress、methos、url、status、protocol、httpVersion、Response Headers、Request Headers、Query String Parameter、Form Data，（不会记录Content-Type: multipart/form-data的请求body）
```
::1 POST /url?test=1 200 OK http HTTP/1.1
    Response Headers
       x-powered-by:Express
       content-type:text/html; charset=utf-8
    Request Headers
       host:localhost:3000
       connection:keep-alive
       content-length:10
       pragma:no-cache
       cache-control:no-cache
       origin:http://localhost:3000
       upgrade-insecure-requests:1
       user-agent:Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36
       content-type:application/x-www-form-urlencoded
       accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
       referer:http://localhost:3000/index
       accept-encoding:gzip, deflate, br
       accept-language:zh,en-US;q=0.8,en;q=0.6
       cookie:nfd=123456
    Query String Parameter
       test:1
    Form Data
       name:Bob
```
