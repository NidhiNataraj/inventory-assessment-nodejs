const UserModel = require('../../Database/UserModel');
const Utils = require('../../Helpers/Utils');
const logger = require('../../Helpers/Logger');
const bcrypt = require('bcrypt');

const UserController = {
	adminLogin : async (req) => {
		try {
			const { email, password } = req;
			if (Utils?.isEmpty(email) || Utils?.isEmpty(password)) {
				return {error: true, message: 'Email and password are required'};
			}

			const user = await UserModel.findOne({ email, role: 'admin' }).lean();
			if (Utils?.isEmpty(user)) {
				return {error: true, message : "Invalid email or password"};
			}

			const isMatch = await bcrypt.compare(password, user?.password);
			if (!isMatch) {
				return {error: true, message: "Invalid email or password"};
			}

			const token = Utils?.getUniqueId(user);

			const data = {
				token,
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
				},
			};
			return {	
				error: false,
				message: 'Login successfully',
				data
			};
		} catch (error) {
			return {error: true, message: "Internal Server Error"};
		}
	},

	userLogin : async (req) => {
		try {
			const { email, password } = req;
			if (Utils?.isEmpty(email) || Utils?.isEmpty(password)) {
				return {error: true, message: 'Email and password are required'};
			}

			const user = await UserModel.findOne({ email, role: 'user' }).lean();
			if (Utils?.isEmpty(user)) {
				return {error: true, message : "Invalid email or password"};
			}

			const isMatch = await bcrypt.compare(password, user?.password);
			if (!isMatch) {
				return {error: true, message : "Invalid email or password"};
			}

			const token = Utils?.getUniqueId(user);

			const data = {
				token,
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
				},
			};
			return {	
				error: false,
				message: 'Login successfully',
				data
			};
		} catch (error) {
			return {error: true, message: "Internal Server Error"};
		}
	},

	createUser: async (data) => {
		try {
			const createUser = {
				user_no : 'USR' + Utils.getShortId(),
				email : data?.email,
				password : data?.password,
				role: 'user',
				name: data?.name
			};

			const createUserData = await UserModel.create(createUser);
			if (Utils?.isEmpty(createUserData)) {
				logger.error({
					functionName: 'createUser',
					message: 'Failed to create user',
					data: {data}
				});
				return {error: true, message: 'Failed to create user'};
			}
			return {
				error: false,
				message: 'User created',
				data: {user: createUserData}
			};
		} catch (error) {
			logger.error({
				functionName: 'createUser',
				message: error?.message,
				error,
				data: {data}
			});
			return {error: true, message: 'Something went wrong'};
		}
	}
};
module.exports = UserController;
