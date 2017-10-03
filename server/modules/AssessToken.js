/*
 *. token表 模型
 */

var mongoose = require('mongoose')
var assessToken = require('../schema/AssessToken');

module.exports = mongoose.model('AssessToken', assessToken);