const Express = require('express');
const Router = Express();
const ProductController = require('./ProductController');
const ProductValidation = require('./ProductValidation');
const Responder = require('../../App/Responder');
const {validationResult} = require('express-validator');
const {isEmpty} = require('../../Helpers/Utils');
const Logger = require('../../Helpers/Logger');
const Authentication = require('../../Helpers/Authentication');
const Authorization = require("../../Helpers/Authorization");

Router.post(
	'/create',
	Authentication(),
	Authorization('user'),
	ProductValidation.createProductValidation(),
	async (request, response) => {
		try {
			if (request?.body?.logged_user?.role !== 'user') {
				return Responder.sendFailureMessage(response, 'User Not Authorized', 401);
			}
			const hasErrors = validationResult(request);
			if (hasErrors.isEmpty()) {
				const {error, message, data} = await ProductController.createProduct(
					request?.body,
				);
				if (!isEmpty(data) && error === false) {
					return Responder.sendSuccessData(response, message, data);
				}
				return Responder.sendFailureMessage(response, message, 400);
			} else {
				return Responder.sendFailureMessage(
					response,
					hasErrors?.errors[0]?.msg,
					422
				);
			}
		} catch (error) {
			Logger.error({
				functionName: 'createProduct',
				message: `From Router: ${error?.message}`,
				data: {
					body: request?.body,
				}
			});
			return Responder.sendFailureMessage(response, error, 500);
		}
	}
);

Router.patch(
	'/update/:productNo',
	Authentication(),
	Authorization('user'),
	ProductValidation.createProductValidation(),
	async (request, response) => {
		try {
			if (request?.body?.logged_user?.role !== 'user') {
				return Responder.sendFailureMessage(response, 'User Not Authorized', 401);
			}
			const hasErrors = validationResult(request);
			if (hasErrors.isEmpty()) {
				const {error, message, data} = await ProductController.updateProduct(
					request?.params?.productNo,
					request?.body
				);

				if (!isEmpty(data) && error === false) {
					return Responder.sendSuccessData(response, message, data);
				}
				return Responder.sendFailureMessage(response, message, 400);
			} else {
				return Responder.sendFailureMessage(
					response,
					hasErrors?.errors[0]?.msg,
					422
				);
			}
		} catch (error) {
			Logger.error({
				functionName: 'updateProduct',
				message: `From Router: ${error?.message}`,
				data: {
					body: request?.body,
					params: request?.params?.ProductId,
					headers: request?.headers['x-consumer-username']
				}
			});
			return Responder.sendFailureMessage(response, error, 500);
		}
	}
);

Router.get(
	'/list',
	Authentication(),
	Authorization('user'),
	ProductValidation.ProductListValidation(),
	async (request, response) => {
		try {
			if (request?.body?.logged_user?.role !== 'user') {
				return Responder.sendFailureMessage(response, 'User Not Authorized', 401);
			}
			const hasErrors = validationResult(request);
			if (hasErrors.isEmpty()) {
				const {error, message, data} = await ProductController.getProducts(
					request?.query,
					request?.body?.logged_user
				);

				if (!isEmpty(data) && error === false) {
					return Responder.sendSuccessData(response, message, data);
				}
				return Responder.sendFailureMessage(response, message, 400);
			} else {
				return Responder.sendFailureMessage(
					response,
					hasErrors?.errors[0]?.msg,
					422
				);
			}
		} catch (error) {
			Logger.error({
				functionName: 'getProductList',
				message: `From Router: ${error?.message}`,
				data: {
					query: request?.query,
					headers: request?.headers['x-consumer-username']
				}
			});
			return Responder.sendFailureMessage(response, error, 500);
		}
	}
);

Router.get('/detail/:productNo', Authentication(), Authorization('user'),async (request, response) => {
	try {
		if (request?.body?.logged_user?.role !== 'user') {
			return Responder.sendFailureMessage(response, 'User Not Authorized', 401);
		}
		const {error, message, data} = await ProductController.getProductDetail(
			request?.params?.productNo,
			request?.body?.logged_user
		);

		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		Logger.error({
			functionName: 'getProductDetail',
			message: `From Router: ${error?.message}`,
			data: {
				params: request?.params?.productNo
			}
		});
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.get(
	'/overall-product/list',
	Authentication(),
	Authorization('user'),
	ProductValidation.ProductListValidation(),
	async (request, response) => {
		try {
			if (request?.body?.logged_user?.role !== 'user') {
				return Responder.sendFailureMessage(response, 'User Not Authorized', 401);
			}
			const hasErrors = validationResult(request);
			if (hasErrors.isEmpty()) {
				const {error, message, data} = await ProductController.categoryBasedProductList(
					request?.query,
					request?.body?.logged_user
				);

				if (!isEmpty(data) && error === false) {
					return Responder.sendSuccessData(response, message, data);
				}
				return Responder.sendFailureMessage(response, message, 400);
			} else {
				return Responder.sendFailureMessage(
					response,
					hasErrors?.errors[0]?.msg,
					422
				);
			}
		} catch (error) {
			Logger.error({
				functionName: 'categoryBasedProductList',
				message: `From Router: ${error?.message}`,
				data: {
					query: request?.query,
				}
			});
			return Responder.sendFailureMessage(response, error, 500);
		}
	}
);

	Router.delete('/delete/:productNo/:categoryNo', Authentication(), Authorization('user'), async (request, response) => {
		try {
			if (request?.body?.logged_user?.role !== 'user') {
				return Responder.sendFailureMessage(response, 'User Not Authorized', 401);
			}
			const {error, message, data} = await ProductController.deleteProduct(
				request?.params?.productNo,
				request?.params?.categoryNo,
				request?.body?.logged_user
			);

			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} catch (error) {
			Logger.error({
				functionName: 'deleteProducts',
				message: `From Router: ${error?.message}`,
				data: {
					productNo: request?.params?.productNo,
					categoryNo: request?.params?.categoryNo,
				}
			});
			return Responder.sendFailureMessage(response, error, 500);
		}
	});

	Router.get(
	'/admin-product/list',
	Authentication(),
	Authorization('admin'),
	ProductValidation.ProductListValidation(),
	async (request, response) => {
		try {
			if (request?.body?.logged_user?.role !== 'admin') {
				return Responder.sendFailureMessage(response, 'User Not Authorized', 401);
			}
			const hasErrors = validationResult(request);
			if (hasErrors.isEmpty()) {
				const {error, message, data} = await ProductController.AdminProductList(
					request?.query,
					request?.body?.logged_user
				);

				if (!isEmpty(data) && error === false) {
					return Responder.sendSuccessData(response, message, data);
				}
				return Responder.sendFailureMessage(response, message, 400);
			} else {
				return Responder.sendFailureMessage(
					response,
					hasErrors?.errors[0]?.msg,
					422
				);
			}
		} catch (error) {
			Logger.error({
				functionName: 'AdminProductList',
				message: `From Router: ${error?.message}`,
				data: {
					query: request?.query,
				}
			});
			return Responder.sendFailureMessage(response, error, 500);
		}
	}
);

module.exports = Router;
