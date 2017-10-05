/*
 *  @description  统一验证是否登录微信服务器  assess_token验证是否过期 过期重新加载新的token
 */

var sha1 = require('sha1');
var request = require('request-promise');
var getRawBody = require('raw-body');
var util = require('../util/util');
var AssessToken = require('../modules/AssessToken');

var api = 'https://api.weixin.qq.com/cgi-bin/';

function Wechat (opts) {  // 检测是否是最近票据
	this.appID = opts.appID;
	this.appsecret = opts.appsecret;
	this.getAccessToken = opts.getAccessToken;
	this.updateAccessToken = opts.updateAccessToken;

	this.getAccessToken()
		.then((data) => {
			try { // 检测是否有assessToken 没有即更新
				data = JSON.parse(data);
			} catch (e) {
				return this.updateAccessToken(data);
			}

			if (this.isValAssessToken(data)) { // 判断assessToken是否是两个小时以内最新token
				Promise.resolve(data);
			} else {
				return this.updateAccessToken(data);
			}
		})
		.then((data) => { // 触发更新回调存入数据库
			this.assess_token = data.assess_token;
			this.expires_in = data.expries_in;

			this.saveAssessToken(data);
		})
};

Wechat.prototype.isValAssessToken = function (data) { // 检测data 是否过期
	if (!data || !data.assess_token || !data.expires_in) {
		return false;
	}

	var nowTime = (new Date().getTime());

	if (nowTime < data.expires_in) {
		return true;
	} else {
		return false;
	}
};

Wechat.prototype.updateAccessToken = function (data) { // 更新token 
	var url = `${api}token?grant_type=client_credential&appid=${this.appID}&secret=${this.appsecret}`;

	return new Promise((resolve, reject) => {
		request({url: url, json: true}).then((response) => {
			var data = response[1];
			var nowTime = (new Date.getTime());
			var expries_in = nowTime + (data.expries_in - 20) * 1000;

			console.log('request data:', data);
			data.expries_in = expries_in;

			resolve(data);

		});
	});
};

module.exports = function (opts) {
	// var wechat = new Wechat(opts);
	return function * (next) {

		// res.send('mismatch');
		// 1. 获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
		var signature = this.query.signature, // 微信加密签名
			timestamp = this.query.timestamp, // 时间戳
			nonce = this.query.nonce, // 随机数
			echostr = this.query.echostr; // 随机字符串

		// new AssessToken({assess_token: signature}).save().then(err => {
		// 	console.log('assesstoken:', err);
		// })
		// 2. 将token、timestamp、nonce 三个参数进行字典序排序
		var arr = [opts.token, timestamp, nonce].sort().join('');

		// 3. 将三个参数字符串拼接成一个字符串进行sha1加密
		var resultCode = sha1(arr); // 对传入的字符串进行加密

		var request = this.request;
		// 4. 开发者获得加密后的字符串可与signature对比，标识该请求来源微信
		if ( resultCode === signature) {
			if (request.method === 'GET') {
				
			} else if (request.method === 'POST') {
				var data = yield getRawBody(this.req, {
					length: this.length,
					limit: '1mb',
					encoding: this.charset
				})
				var content = yield util.parseXmlAsync(data);
				var message = util.formatObj(content.xml);
			}
			console.log('通过了。。。');
			this.body = echostr;
		} else {
			this.body = 'mismatch';
		}

	}
};
