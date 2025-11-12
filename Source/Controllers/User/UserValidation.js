const {check} = require('express-validator');
const UserValidation = {
	loginValidation: () => [
		check('email', 'Please provide email ID.')
			.trim()
			.notEmpty()
			.isEmail()
			.withMessage('Please enter a valid email ID.'),
		check('password', 'Please provide password')
			.trim()
			.notEmpty(),
	],

	createUserValidation: () => [
		check('name', 'Please enter the user name')
			.trim()
			.notEmpty(),
		check('email', 'Please provide email ID.')
			.trim()
			.notEmpty()
			.isEmail()
			.withMessage('Please enter a valid email ID.'),
		check('password', 'Please provide password')
			.trim()
			.notEmpty(),
	],
};
module.exports = UserValidation;
