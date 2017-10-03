/*
 *. token表
 */

var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
	assess_token: String, // token
	timeamp: { // 时间戳
		type: Date,
		default: Date.now
	}
});
