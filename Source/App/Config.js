const Dotenv = require('dotenv');
Dotenv.config({path: 'Source/App/.env'});
const environment = process.env;

module.exports = {
	JWT_SECRET: 'supersecretkey123',
	DB_URL: {
		Inventory:
			environment?.DB_URL_INVENTORY ||
			'mongodb+srv://nidhinataraj06_db_user:invUser@cluster0.k0lsydy.mongodb.net/Invetory' 
	}
};
