var express = require('express');
var crypto = require ('crypto');
var main = require('./index/index');
var app = express();
var config = {
	"token": "wechat",
	"assessToken": "https://api.weixin.qq.com/cgi-bin/"
};

app.use(main(config));

console.log('-------------------开启端口-------------------');
app.listen(8082);
console.log('-------------------开启成功-------------------')