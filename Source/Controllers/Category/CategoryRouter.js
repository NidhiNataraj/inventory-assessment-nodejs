const Express = require("express");
const Router = Express.Router();
const CategoryController = require("./CategoryController");
const CategoryValidation = require("./CategoryValidation");
const Responder = require("../../App/Responder");
const { validationResult } = require("express-validator");
const { isEmpty } = require("../../Helpers/Utils");
const Logger = require("../../Helpers/Logger");
const Authentication = require("../../Helpers/Authentication");
const Authorization = require("../../Helpers/Authorization");

Router.post(
    "/create",
    Authentication(),
    Authorization("admin"),
    CategoryValidation.createCategoryValidation(),
    async (request, response) => {
        try {
            if (request?.body?.logged_user?.role !== "admin") {
                return Responder.sendFailureMessage(
                    response,
                    "User Not Authorized",
                    401
                );
            }
            const hasErrors = validationResult(request);
            if (hasErrors.isEmpty()) {
                const { error, message, data } =
                    await CategoryController.addcategory(
                        request?.body,
                        request?.headers["x-consumer-username"]
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
                functionName: "createBulkCategory",
                message: `From Router: ${error?.message}`,
                data: {
                    body: request?.body,
                    headers: request?.headers["x-consumer-username"],
                },
            });
            return Responder.sendFailureMessage(response, error, 500);
        }
    }
);

Router.get(
    "/list",
    Authentication(),
    Authorization("admin"),
    CategoryValidation.CategoryListValidation(),
    async (request, response) => {
        try {
            if (request?.body?.logged_user?.role !== "admin") {
                return Responder.sendFailureMessage(
                    response,
                    "User Not Authorized",
                    401
                );
            }
            const hasErrors = validationResult(request);
            if (hasErrors.isEmpty()) {
                const { error, message, data } =
                    await CategoryController.getCategoryList(
                        request?.query,
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
                functionName: "getCategoryList",
                message: `From Router: ${error?.message}`,
                data: {
                    query: request?.query,
                    headers: request?.headers["x-consumer-username"],
                },
            });
            return Responder.sendFailureMessage(response, error, 500);
        }
    }
);

Router.get(
    "/detail/:categoryNo",
    Authentication(),
    Authorization("admin"),
    async (request, response) => {
        try {
            if (request?.body?.logged_user?.role !== "admin") {
                return Responder.sendFailureMessage(
                    response,
                    "User Not Authorized",
                    401
                );
            }
            const { error, message, data } =
                await CategoryController.getCategoryDetails(
                    request?.params?.categoryNo,
                    request?.body?.logged_user
                );

            if (!isEmpty(data) && error === false) {
                return Responder.sendSuccessData(response, message, data);
            }
            return Responder.sendFailureMessage(response, message, 400);
        } catch (error) {
            Logger.error({
                functionName: "getCategoryDetails",
                message: `From Router: ${error?.message}`,
                data: {
                    params: request?.params?.productNo,
                },
            });
            return Responder.sendFailureMessage(response, error, 500);
        }
    }
);

Router.delete(
    "/delete/:categoryNo",
    Authentication(),
    Authorization("admin"),
    async (request, response) => {
        try {
            if (request?.body?.logged_user?.role !== "admin") {
                return Responder.sendFailureMessage(
                    response,
                    "User Not Authorized",
                    401
                );
            }
            const { error, message, data } =
                await CategoryController.deleteCategory(
                    request?.params?.categoryNo,
                    request?.body?.logged_user
                );

            if (!isEmpty(data) && error === false) {
                return Responder.sendSuccessData(response, message, data);
            }
            return Responder.sendFailureMessage(response, message, 400);
        } catch (error) {
            Logger.error({
                functionName: "deleteCategory",
                message: `From Router: ${error?.message}`,
                data: {
                    params: request?.params?.productNo,
                },
            });
            return Responder.sendFailureMessage(response, error, 500);
        }
    }
);

Router.patch(
	'/update/:categoryNo',
	Authentication(),
    Authorization("admin"),
	CategoryValidation.createCategoryValidation(),
	async (request, response) => {
		try {
			if (request?.body?.logged_user?.role !== 'admin') {
				return Responder.sendFailureMessage(response, 'User Not Authorized', 401);
			}
			const hasErrors = validationResult(request);
			if (hasErrors.isEmpty()) {
				const {error, message, data} = await CategoryController.updateCategory(
					request?.params?.categoryNo,
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
				functionName: 'updateCategory',
				message: `From Router: ${error?.message}`,
				data: {
					body: request?.body,
					params: request?.params?.categoryNo
				}
			});
			return Responder.sendFailureMessage(response, error, 500);
		}
	}
);

module.exports = Router;
