const mongoose = require('mongoose');
exports.create = () => {
	const mongeese = new mongoose.Mongoose();
	let key;
	let value;
	for (key in mongoose) {
		if (mongoose.hasOwnProperty(key)) {
			value = mongoose[key];
			if (!mongeese[key]) {
				mongeese[key] = value;
			}
		}
	}
	return mongeese;
};
