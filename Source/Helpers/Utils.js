const Config = require('../App/Config');
const {customAlphabet} = require('nanoid');
const ShortId = customAlphabet(
	'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
);
const jwt = require("jsonwebtoken");

const Utils = {
	isEmpty: (data) => {
		if (data === null || data === undefined) {
			return true;
		}
		if (typeof data === 'string' && data.replace(/ /g, '').length > 0) {
			return false;
		}
		if (typeof data === 'number') {
			return false;
		}
		if (typeof data === 'boolean') {
			return false;
		}
		if (Array.isArray(data) && data.length > 0) {
			return false;
		}
		return !(typeof data === 'object' && Object.keys(data).length > 0);
	},
	
	getShortId: (size = 13) => ShortId().slice(0, size),

	getUniqueId: (user) => {
		const payload = { sub: user._id, role: user?.role_id || "user" };
    	const options = { expiresIn: "1h" };
    	return jwt.sign(payload, Config?.JWT_SECRET, options);
	}
};

module.exports = Utils;
