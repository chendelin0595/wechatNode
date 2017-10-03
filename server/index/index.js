/*
 *  @description  统一验证是否登录微信服务器  assess_token验证是否过期 过期重新加载新的token
 */

var crypto = require ('crypto');
var AssessToken = require('../modules/AssessToken');

module.exports = function (opts) {
	return function (req, res) {
		// res.send('mismatch');
		// 1. 获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
		var signature = req.query.signature, // 微信加密签名
			timestamp = req.query.timestamp, // 时间戳
			nonce = req.query.nonce, // 随机数
			echostr = req.query.echostr; // 随机字符串
		console.log('--------------------------------------');
		console.log('signature', signature);
		console.log('--------------------------------------');

		new AssessToken({assess_token: signature}).save().then(err => {
			console.log('assesstoken:', err);
		})
		// 2. 将token、timestamp、nonce 三个参数进行字典序排序
		var arr = [opts.token, timestamp, nonce].sort().join('');

		// 3. 将三个参数字符串拼接成一个字符串进行sha1加密
		const hashCode = crypto.createHash('sha1'); // 创建加密类型
		var resultCode = hashCode.update(arr, 'utf8').digest('hex'); // 对传入的字符串进行加密

		// 4. 开发者获得加密后的字符串可与signature对比，标识该请求来源微信

		if ( resultCode === signature) {
			console.log('通过了。。。');
			res.send(echostr);
		} else {
			res.send('mismatch');
		}
	}
}
