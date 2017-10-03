var express = require('express');
var crypto = require ('crypto');
var mongoose = require('mongoose');
var main = require('./index/index');
var app = express();
var config = {
	"token": "wechat",
	"assessToken": "https://api.weixin.qq.com/cgi-bin/"
};

app.use(main(config));

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/wechat', (err) => {
	if (err) {
		console.log('数据库连接失败');
	} else {
		console.log('数据库连接成功');
	}
})


console.log('-------------------开启端口-------------------');
app.listen(8082);
console.log('-------------------开启成功-------------------');
