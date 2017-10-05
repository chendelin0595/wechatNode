/*
 * server 服务端  通用工具类
 */
var xml2js = require('xml2js');


exports.parseXmlAsync = function (xml) { // xml 转换obj对象
	return new Promise((resolve, reject) => {
		xml2js.parseString(xml, {trim: true}, (err, content) => {
			if (err) reject(err);
			else resolve(content);
		})
	});
};

function formatObj (obj) { // 将对象转换成正确的格式
	var result = {};
	if (typeof obj === 'object') {
		for (var i in obj) {
			var item = obj[i];
			if (!(item instanceof Array) || !item.length) {
				continue;
			}
			if (item.length === 1) {
				let val = item[0];

				if (typeof val === 'object') {
					result[i] = formatObj(val);
				} else {
					result[i] = val.trim();
				}
			} else {
				result[i] = []

				for (var j of item) {
					result[i].push(formatObj(j));
				} 
			}
		}
	}
	return result;
}

exports.formatObj = formatObj;