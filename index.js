'use strict';

var ptr = require('path-to-regexp');

var PATTERN_RULE = /^([a-z]+)?\s*(\/.*)?$/i;

module.exports = function (rule) {
	var keys = [],
		re = (rule || '/').match(PATTERN_RULE),
		method = new RegExp(re[1] || '.*', 'i'),
		pathname = ptr(re[2], keys);

	return function *(next) {
		var req = this.request,
			re;

		if (re = req.method().match(method)) { // Assign.
			if (re = req.pathname.match(pathname)) { // Assign.
				req.params = {};
				
				keys.forEach(function (key, index) {
					req.params[key.name] = re[index + 1];
				});
				
				yield next;
			}
		}
	};
};