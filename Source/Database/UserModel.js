const DBConnections = require('../App/Connection');
const getUserDB = DBConnections.getInventoryDBConnection();
const timestamps = require('mongoose-timestamp');
const MongooseSoftDelete = require('mongoose-delete');
const bcrypt = require("bcrypt");

const userSchema = new getUserDB.Schema({
	  user_no: {type: String, required : true},
	  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  	password: { type: String, required: true },
  	name: { type: String },
  	role: { type: String, enum: ['admin', 'user'], default: 'user' }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.plugin(timestamps);
userSchema.plugin(MongooseSoftDelete, {overrideMethods: 'all'});

const UserModel = getUserDB.model('user', userSchema);

module.exports = UserModel;
