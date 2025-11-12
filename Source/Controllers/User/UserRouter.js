const Express = require('express');
const Router = Express.Router();
const UserController = require('./UserController');
const UserValidation = require('./UserValidation');
const {validationResult} = require('express-validator');
const Responder = require('../../App/Responder');
const {isEmpty} = require('../../Helpers/Utils');
const Logger = require('../../Helpers/Logger');
const Authentication = require('../../Helpers/Authentication');
const Authorization = require('../../Helpers/Authorization');

Router.post(
	'/admin-login',
	UserValidation.loginValidation(),
	async (request, response) => {
		try {
			const hasErrors = validationResult(request);
			if (hasErrors.isEmpty()) {
				const {error, message, data} =
					await UserController.adminLogin(
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
				functionName: 'adminLogin',
				message: `From Router: ${error?.message}`,
				data: {
					body: request?.body,
					headers: request?.headers
				}
			});
			return Responder.sendFailureMessage(response, error, 500);
		}
	}
);

Router.post(
	'/login',
	UserValidation.loginValidation(),
	async (request, response) => {
		try {
			const hasErrors = validationResult(request);
			if (hasErrors.isEmpty()) {
				const {error, message, data} =
					await UserController.userLogin(
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
				functionName: 'userLogin',
				message: `From Router: ${error?.message}`,
				data: {
					body: request?.body,
					headers: request?.headers
				}
			});
			return Responder.sendFailureMessage(response, error, 500);
		}
	}
);

Router.post(
	'/create',
	Authentication(),
	Authorization('admin'),
	UserValidation.createUserValidation(),
	async (request, response) => {
		try {
			const hasErrors = validationResult(request);
			if (hasErrors.isEmpty()) {
				const {error, message, data} =
					await UserController.createUser(
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
				functionName: 'createUser',
				message: `From Router: ${error?.message}`,
				data: {
					body: request?.body,
					headers: request?.headers
				}
			});
			return Responder.sendFailureMessage(response, error, 500);
		}
	}
);

module.exports = Router;
