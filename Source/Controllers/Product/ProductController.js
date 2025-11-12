const ProductModel = require('../../Database/ProductModel');
const CategoryModel = require('../../Database/CategoryModel');
const Utils = require('../../Helpers/Utils');
const logger = require('../../Helpers/Logger');

const ProductController = {
	createProduct: async (data) => {
		try {
			const getCategory = await CategoryModel.findOne({category_id: data?.category_id},{
				category_no: 1,
			});
			if(Utils?.isEmpty(getCategory?.category_no)){
				logger.error({
					functionName: 'createProduct',
					message: 'Category does not exists',
					data
				});
				return {error: true, message: 'Category does not exists'};
			}
			const productData = {
				name : data?.name,
				product_no : 'PRD' + Utils.getShortId(),
				category_id: data?.category_id,
				user_id: data?.logged_user?.iuser_no,
				sku: data?.sku || '',
				description: data?.description || '',
				price : data?.price,
				quantity : data?.quantity,
				quantity_type: data?.quantity_type
			};		
			const createProduct = await ProductModel.create(productData);
			if (Utils?.isEmpty(createProduct)) {
				logger.error({
					functionName: 'createProduct',
					message: 'Product creation failed',
					data
				});
				return {error: true, message: 'Product creation failed'};
			}
			return {
				error: false,
				message: 'Product created',
				data: {product: createProduct}
			};
		} catch (error) {
			logger.error({
				functionName: 'createProduct',
				message: error?.message,
				error,
				data: {merchantId, data}
			});
			return {error: true, message: 'Something went wrong'};
		}
	},

	getProducts: async (query = {}, data) => {
		try {
			const userNo = data?.user_no;

			let limit = Number.parseInt(query.limit) || 20;
			let page = Number.parseInt(query.page) || 1;
			const skip = (page - 1) * limit;

			const matchStage = {
				user_id: userNo,
				deleted: { $ne: true },
			};

			if (!Utils?.isEmpty(query?.quantity_type)) {
				matchStage.quantity_type = query?.quantity_type;
			}

			const pipeline = [
				{ $match: matchStage },
				{
					$lookup: {
						from: "categories",
						localField: "category_id",
						foreignField: "category_no",
						as: "category",
					},
				},
				{
					$unwind: {
						path: "$category",
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$lookup: {
						from: "users",
						localField: "user_id",
						foreignField: "user_no",
						as: "user",
					},
				},
				{ 
					$unwind: { path: "$user", preserveNullAndEmptyArrays: true } 
				},
			];
			if (!Utils?.isEmpty(query?.search_term)) {
				let searchTerm = query?.search_term.trim();
				pipeline.push({
					$match: {
					$or: [
						{ name: { $regex: searchTerm, $options: "i" } },
						{ "product.name": { $regex: searchTerm, $options: "i"}},
						{ "category.name": { $regex: searchTerm, $options: "i" }},
						// { "user.name": { $regex: searchTerm, $options: "i" } },
					],
					},
				});
			}
			pipeline.push(
				{
				$project: {
					product_no: 1,
					name: 1,
					category_id: 1,
					user_id: 1,
					sku: 1,
					description: 1,
					price: 1,
					quantity: 1,
					quantity_type: 1,
					createdAt: 1,
					"category.category_no": 1,
					"category.user_no":1,
					"category.name": 1,
					"category.description": 1,
					"user.user_no": 1,
					"user.name": 1,
					"user.email": 1,
					"user.role": 1,
					},
				},
				{ $sort: { createdAt: -1 } },
				{
					$facet: {
						metadata: [{ $count: "total" }],
						data: [{ $skip: skip }, { $limit: limit }],
					},
				}
			);

			const result = await ProductModel.aggregate(pipeline);
			const products = result[0]?.data || [];
			const total = result[0]?.metadata[0]?.total || 0;

			if (Utils.isEmpty(products)) {
				return { error: true, message: "No products found" };
			}
			return {
				error: false,
				message: "Product list retrieved successfully",
				data: { products, total },
			};
		} catch (error) {
			logger.error({
				functionName: "getProductsList",
				message: error.message,
				error,
				data: { query },
			});
			
			return { error: true, message: "Something went wrong" };
		}
	},

	getProductDetail: async (productNo, loggedUser) => {
		try {
			const getProduct = await ProductModel.findOne(
				{product_no: productNo, user_id: loggedUser?.user_no},
				{_id: 0, __v: 0}
			).lean();
			if (Utils?.isEmpty(getProduct)) {
				logger.error({
					functionName: 'getProductDetail',
					message: 'Product detail not found',
					data: {productNo, loggedUser}
				});
				return {error: true, message: 'Product details not found'};
			}
			return {
				error: false,
				message: 'Product details are',
				data: {Product: getProduct}
			};
		} catch (error) {
			logger.error({
				functionName: 'getProductDetail',
				message: error?.message,
				error,
				data: {ProductId, loggedUser}
			});
			return {error: true, message: 'Something went wrong'};
		}
	},

	categoryBasedProductList: async (query = {}, data) => {
		try {
			const userNo = data?.user_no;

			const matchStage = {
				user_id: userNo,
				deleted: { $ne: true },
			};
			if(!Utils?.isEmpty(query?.category_no)) {
 				matchStage.category_id = query.category_no;
			}

			if (!Utils?.isEmpty(query?.search_term)) {
				const searchTerm = new RegExp(query.search_term, "i");
				matchStage.$or = [
					{ name: searchTerm },
					{ description: searchTerm },
					{ sku: searchTerm },
				];
			}

			const pipeline = [
			{ $match: matchStage },
			{
				$lookup: {
				from: "categories",
				localField: "category_id",
					foreignField: "category_no",
					as: "category",
					},
				},
				{ $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
				{
					$group: {
					_id: "$category.category_no",
					category_name: { $first: "$category.name" },
					category_description: { $first: "$category.description" },
					products: {
						$push: {
						product_no: "$product_no",
						name: "$name",
						description: "$description",
						sku: "$sku",
						price: "$price",
						quantity: "$quantity",
						quantity_type: "$quantity_type",
						createdAt: "$createdAt",
						},
					},
					totalCategories: { $sum: 1 },
					},
				},
				{ $sort: { category_name: 1 } },
			];

			const result = await ProductModel.aggregate(pipeline);

			if (Utils.isEmpty(result)) {
				return { error: true, message: "No products found for any category" };
			}

			return {
				error: false,
				message: "Category-based product list retrieved successfully",
				data: result,
			};
		} catch (error) {
			logger.error({
				functionName: "categoryBasedProductList",
				message: error.message,
				error,
				data: { query },
			});
			return { error: true, message: "Something went wrong" };
		}
	},

	AdminProductList: async (query = {}, data) => {
		try {
			const adminNo = data?.user_no;

			const matchStage = { deleted: { $ne: true } };

			if (!Utils?.isEmpty(query?.search_term)) {
			const searchTerm = new RegExp(query.search_term, "i");
				matchStage.$or = [
					{ name: searchTerm },
					{ description: searchTerm },
					{ sku: searchTerm },
				];
			}

			if (!Utils?.isEmpty(query?.category_no)) {
				matchStage.category_id = query.category_no;
			}

			const pipeline = [
			{ $match: matchStage },
			{
				$lookup: {
				from: "categories",
				localField: "category_id",
				foreignField: "category_no",
				as: "category",
				},
			},
			{ $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
			{ $match: { "category.user_no": adminNo } },
			{
				$lookup: {
				from: "users",
				localField: "user_id",
				foreignField: "user_no",
				as: "user",
				},
			},
			{ $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
			...(query?.user_no
				? [{ $match: { "user.user_no": query.user_no } }]
				: []),
			{
				$group: {
				_id: "$category.category_no",
				category_name: { $first: "$category.name" },
				category_description: { $first: "$category.description" },
				products: {
					$push: {
					product_no: "$product_no",
					name: "$name",
					description: "$description",
					sku: "$sku",
					price: "$price",
					quantity: "$quantity",
					quantity_type: "$quantity_type",
					createdAt: "$createdAt",
					user: {
						user_no: "$user.user_no",
						name: "$user.name",
						email: "$user.email",
					},
					},
				},
				totalProducts: { $sum: 1 },
				},
				},
				{ $sort: { category_name: 1 } },
			];

			const result = await ProductModel.aggregate(pipeline);

			if (Utils.isEmpty(result)) {
				return { error: true, message: "No products found" };
			}

			return {
				error: false,
				message: "Admin category-based product list retrieved successfully",
				data: result,
			};
		} catch (error) {
			logger.error({
				functionName: "AdminProductList",
				message: error.message,
				error,
				data: { query },
			});
			return { error: true, message: "Something went wrong" };
		}
	},



	deleteProduct: async(productNo, categoryNo, loggedUser) => {
		try {
			const getProduct = await ProductModel.findOne(
				{category_id: categoryNo, product_no: productNo, user_id: loggedUser?.user_no, deleted: false},
				{deleted: 1, category_no: 1, product_no: 1}
			);
			if (Utils?.isEmpty(getProduct)) {
				logger.error({
					functionName: 'deleteProduct',
					message: 'Product detail not found',
					data: {categoryNo, loggedUser}
				});
				return {error: true, message: 'Product details not found'};
			}
			getProduct.deleted = true;
			getProduct.markModified('deleted');
			await getProduct.save();

			return {
				error: false,
				message: 'Product deleted successfully'
			};
		} catch (error) {
			logger.error({
				functionName: 'deleteProduct',
				message: error?.message,
				error,
				data: {categoryNo, productNo, loggedUser}
			});
			return {error: true, message: 'Something went wrong'};
		}
	},

	updateProduct: async (productNo, data) => {
		try {
			const getProduct = await ProductModel.findOne(
				{category_id: data?.category_id, product_no: productNo, user_id: data?.logged_user?.user_no, deleted: false}
			);
			if (Utils?.isEmpty(getProduct)) {
				logger.error({
					functionName: 'updateProduct',
					message: 'Product not found',
					data: {productNo, data}
				});
				return {error: true, message: 'Product not found'};
			}
			getProduct.name = data?.name || getProduct?.name;
			getProduct.category_id = data?.category_id || getProduct?.category_id;
			getProduct.sku = data?.sku || getProduct?.sku;
			getProduct.description = data?.description || getProduct?.description;
			getProduct.price = data?.price || getProduct?.price;
			getProduct.quantity = data?.quantity || getProduct?.quantity;
			getProduct.quantity_type = data?.quantity_type || getProduct?.quantity_type;

			getProduct.markModified(['name', 'category_id', 'sku', 'description', 'price', 'quantity', 'quantity_type']);
			await getProduct.save();
			if (Utils?.isEmpty(getProduct)) {
				logger.error({
					functionName: 'updateProduct',
					message: 'Failed to update Product details',
					data: {
						productNo,
						loggedUser
					}
				});
				return {
					error: true,
					message: 'Failed to update Product details'
				};
			}
			return {
				error: false,
				message: 'Product updated',
				data: {product: getProduct}
			};
		} catch (error) {
			logger.error({
				functionName: 'updateProduct',
				message: error?.message,
				error,
				data: {productNo, data}
			});
			return {error: true, message: 'Something went wrong'};
		}
	}
};
module.exports = ProductController;
