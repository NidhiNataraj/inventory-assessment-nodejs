const Express = require('express');
const App = Express();
const UserAgent = require('express-useragent');
const Morgan = require('morgan');
const Helmet = require('helmet');
const {isEmpty} = require('../Source/Helpers/Utils');
const Logger = require('../Source/Helpers/Logger');

App.use(UserAgent.express());
App.use(Helmet());
App.use(Express.json());
App.use(Morgan('dev'));

require('./App/Connection')?.createConnection(App);

App.use('/api/inventory/product', require('./Controllers/Product/ProductRouter'));
App.use('/api/inventory/category', require('./Controllers/Category/CategoryRouter'));
App.use(
	'/api/inventory/user',
	require('./Controllers/User/UserRouter')
);


// Global error handler
App.use((error, request, response, next) => {
	if (!isEmpty(error)) {
		Logger.error({
			functionName: 'Internal server error',
			message: error?.message
		});
		return response.status(500).send({
			success: false,
			message: `Internal Server Error: ${error.message || error}`,
			code: error.code || 'error'
		});
	}
	next(error);
});

module.exports = App;
