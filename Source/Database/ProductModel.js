const DBConnections = require('../App/Connection');
const getProductDB = DBConnections.getInventoryDBConnection();
const timestamps = require('mongoose-timestamp');
const MongooseSoftDelete = require('mongoose-delete');


const productSchema = new getProductDB.Schema({
	product_no : {type: String, required: true},
	name: { type: String, required: true },
	category_id: { type: String, required: true },
  	user_id: { type: String, required: true},
	sku: { type: String },
 	description: { type: String },
	price: {type: Number, min: 0},
	quantity: {type: Number, min: 0},
	quantity_type: {type: String, enum:['litres','kg','count'], required: true},
});

productSchema.index({ user_id: 1, category_id: 1 });
productSchema.plugin(timestamps);
productSchema.plugin(MongooseSoftDelete, {overrideMethods: 'all'});

const ProductModel = getProductDB.model('product', productSchema);

module.exports = ProductModel;
