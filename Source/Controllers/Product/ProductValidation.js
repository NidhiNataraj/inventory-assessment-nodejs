const {check} = require('express-validator');

const ProductValidation = {
	createProductValidation: () => [
		check('name', 'Enter the Product name').trim().notEmpty(),
		check('category_id', 'Select a category').trim().notEmpty(),
		check('price', 'Enter a valid product price')
			.trim()
			.custom((value) => {
			const num = parseFloat(value);
			if (isNaN(num) || num <= 0) {
				throw new Error('Price must be a digit');
			}
			return true;
			}),
		check('quantity', 'Enter the product quantity')
			.trim()
			.custom((value) => {
			const num = parseFloat(value);
			if (isNaN(num) || num <= 0) {
				throw new Error('Quantity must be a digit');
			}
			return true;
			}),
		check('quantity_type', 'Quantity type must be litre, kg, or count')
			.trim()
			.isIn(['litres', 'kg', 'count'])
	],

	ProductListValidation: () => [
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
		check('search_term').trim().optional({nullable: true}),
		check('quantity_type').trim().optional({nullable: true})
	]
};
module.exports = ProductValidation;
