const Inventory = require('../App/MongooseConnection').create();
const Config = require('../App/Config');
const DB_URL = Config?.DB_URL;

const DBConnection = {
	createConnection: async (Express) =>
		await new Promise((resolve) => {
			let InventoryDBCheck = false;
			Inventory.set('strictQuery', true);
			Inventory.connect(DB_URL.Inventory, {
				useNewUrlParser: true,
				useUnifiedTopology: true
			});
			
			console.log('Database connection established');
			InventoryDBCheck = true;
			Inventory.set('debug', true);
			resolve([InventoryDBCheck]);
		})
			.then(() => {
				Express.listen('3000', () => {
					console.log('server is listening to 3000');
				});
			})
			.catch((error) => {
				throw error;
			}),
	getInventoryDBConnection: () => Inventory
};

module.exports = DBConnection;
