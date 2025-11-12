const DBConnections = require('../App/Connection');
const getCategoryDB = DBConnections.getInventoryDBConnection();
const timestamps = require('mongoose-timestamp');
const MongooseSoftDelete = require('mongoose-delete');

const categorySchema = new getCategoryDB.Schema({
	name: { type: String, required: true },
	category_no : {type: String, required: true},
 	user_no: { type: String, required: true },
  	description: { type: String }
});

categorySchema.index({ user_no: 1, name: 1 }, { unique: true });

categorySchema.plugin(timestamps);
categorySchema.plugin(MongooseSoftDelete, {overrideMethods: 'all'});

const CategoryModel = getCategoryDB.model('category', categorySchema);

module.exports = CategoryModel;
