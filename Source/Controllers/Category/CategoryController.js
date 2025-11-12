const CategoryModel = require('../../Database/CategoryModel');
const Utils = require('../../Helpers/Utils');
const logger = require('../../Helpers/Logger');

const CategoryController = {
	addcategory: async (data) => {
		try {
			const createCategory = {
				name : data?.name,
				category_no : 'CAT' + Utils?.getShortId(),
				description : data?.description || '',
				user_no: data?.logged_user?.user_no
			};

			const createCategoryData = await CategoryModel.create(createCategory);
			if (Utils?.isEmpty(createCategoryData)) {
				logger.error({
					functionName: 'createCategory',
					message: 'Failed to create category',
					data: {data}
				});
				return {error: true, message: 'Failed to create category'};
			}
			return {
				error: false,
				message: 'Category created',
				data: {category: createCategoryData}
			};
		} catch (error) {
			logger.error({
				functionName: 'createCategory',
				message: error?.message,
				error,
				data: {data}
			});
			return {error: true, message: 'Something went wrong'};
		}
	},

	getCategoryList: async (parseQuery = {}, data) => {
		try {
			let limit = Number.parseInt(parseQuery.limit) || 20;
			let page = Number.parseInt(parseQuery.page) || 1;
			const userNo = data?.logged_user?.user_no;

			const skip = (page - 1) * limit;
			const matchStage = { user_no: userNo, deleted: { $ne: true } };

			if (!Utils?.isEmpty(parseQuery?.search_term)) {
				const searchTerm = new RegExp(parseQuery.search_term, "i");
				matchStage.$or = [
					{ name: searchTerm },
					{ description: searchTerm },
					{ category_no: searchTerm },
				];
			}

			logger.info({
				functionName: "getCategoryList",
				message: "Building aggregation for category list",
				data: { query: parseQuery, matchStage },
			});

			const pipeline = [
			{ $match: matchStage },
			{
				$lookup: {
					from: "users",
					localField: "user_no", 
					foreignField: "user_no", 
					as: "user",
				},
			},
			{
				$unwind: {
					path: "$user",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
			$project: {
				category_no: 1,
				name: 1,
				description: 1,
				createdAt: 1,
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
			},
			];

			const result = await CategoryModel.aggregate(pipeline);
			const categories = result[0]?.data || [];
			const total = result[0]?.metadata[0]?.total || 0;

			if (Utils.isEmpty(categories)) {
				return { error: true, message: "Category list not found" };
			}

			return {
				error: false,
				message: "Category list retrieved successfully",
				data: {
					Category_list: categories,
					total: total || 0,
				},
			};
		} catch (error) {
			logger.error({
				functionName: "getCategoryList",
				message: error?.message,
				error,
				data: { query: parseQuery },
			});
			return { error: true, message: "Something went wrong" };
		}
	},

	getCategoryDetails: async(categoryNo, loggedUser) => {
		try {
			const getCategory = await CategoryModel.findOne(
				{category_no: categoryNo, user_no: loggedUser?.user_no},
				{_id: 0, __v: 0}
			).lean();
			if (Utils?.isEmpty(getCategory)) {
				logger.error({
					functionName: 'getCategoryDetails',
					message: 'Category detail not found',
					data: {categoryNo, loggedUser}
				});
				return {error: true, message: 'Category details not found'};
			}
			return {
				error: false,
				message: 'Category details are',
				data: {category: getCategory}
			};
		} catch (error) {
			logger.error({
				functionName: 'getCategoryDetail',
				message: error?.message,
				error,
				data: {categoryNo, loggedUser}
			});
			return {error: true, message: 'Something went wrong'};
		}
	},

	deleteCategory: async(categoryNo, loggedUser) => {
		try {
			const getCategory = await CategoryModel.findOne(
				{category_no: categoryNo, user_no: loggedUser?.user_no, deleted: false},
				{deleted: 1, category_no: 1}
			);
			if (Utils?.isEmpty(getCategory)) {
				logger.error({
					functionName: 'deleteCategory',
					message: 'Category detail not found',
					data: {categoryNo, loggedUser}
				});
				return {error: true, message: 'Category details not found'};
			}
			getCategory.deleted = true;
			getCategory.markModified('deleted');
			await getCategory.save();

			return {
				error: false,
				message: 'Category deleted successfully'
			};
		} catch (error) {
			logger.error({
				functionName: 'deleteCategory',
				message: error?.message,
				error,
				data: {categoryNo, loggedUser}
			});
			return {error: true, message: 'Something went wrong'};
		}
	},

	updateCategory: async(categoryNo, loggedUser) => {
		try {
			const getCategory = await CategoryModel.findOne(
				{category_no: categoryNo, user_no: loggedUser?.user_no, deleted: false},
				{_id: 0, __v:0}
			);
			if (Utils?.isEmpty(getProduct)) {
				logger.error({
					functionName: 'updateCategory',
					message: 'Category not found',
					data: {categoryNo, loggedUser}
				});
				return {error: true, message: 'Category not found'};
			}
			getCategory.name = data?.name || getCategory?.name;
			getCategory.description = data?.description || getCategory?.description;

			getCategory.markModified(['name', 'description']);
			await getCategory.save();
			if (Utils?.isEmpty(getCategory)) {
				logger.error({
					functionName: 'updateCategory',
					message: 'Failed to update Category details',
					data: {
						categoryNo,
						loggedUser
					}
				});
				return {
					error: true,
					message: 'Failed to update category details'
				};
			}
			return {
				error: false,
				message: 'Category updated',
				data: {product: getCategory}
			};
		} catch (error) {
			logger.error({
				functionName: 'updateCategory',
				message: error?.message,
				error,
				data: {productNo, data}
			});
			return {error: true, message: 'Something went wrong'};
		}		
	}


};
module.exports = CategoryController;
