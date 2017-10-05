var koa = require('koa');
var crypto = require ('crypto');
var mongoose = require('mongoose');
var main = require('./index/index');
var app = new koa();
var config = {
	"token": "wechat",
	"appID": "wx53ee4b478ad479f4",
	"appsecret": "06670dd4240968096758cb3ae0ff14d6",
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
