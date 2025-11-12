const Responder = {
	sendFailureMessage: (response, message, status = 400) => {
		const result = {};
		result.success = false;
		result.message = message || '';
		return response.status(status).send(result);
	},
	sendSuccessMessage: (response, message, status = 200) => {
		const result = {};
		result.success = true;
		result.message = message || '';
		return response.status(status).send(result);
	},
	sendSuccessData: (response, message, data, status = 200) => {
		const result = {};
		result.success = true;
		result.message = message || '';
		result.data = data || {};
		return response.status(status).send(result);
	}
};

module.exports = Responder;
