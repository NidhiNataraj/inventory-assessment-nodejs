const {check} = require('express-validator');

const CategoryValidation = {
	createCategoryValidation: () => [
		check('name', 'Enter the Category name')
			.trim()
			.notEmpty()
			.withMessage('Category name cannot be empty'),
	],

	CategoryListValidation: () => [
		check('limit')
			.trim()
			.optional({nullable: true})
			.isNumeric()
			.withMessage('Limit must be a number'),
		check('page')
			.trim()
			.optional({nullable: true})
			.isNumeric()
			.withMessage('Page must be a number'),
		check('search_term').trim().optional({nullable: true})
	]
};
module.exports = CategoryValidation;
