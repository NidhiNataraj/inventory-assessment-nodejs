const jwt = require("jsonwebtoken");
const Config = require('../App/Config');
const Responder = require("../App/Responder");
const UserModel = require("../Database/UserModel");
const { isEmpty } = require("../Helpers/Utils");

/**
 * JWT Authentication middleware
 * Verifies the Bearer token, decodes it, validates the user,
 * and attaches the logged user to request.body.logged_user
 */
const Authentication = () => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers["authorization"];
            if (isEmpty(authHeader) || !authHeader.startsWith("Bearer ")) {
                return Responder.sendFailureMessage(res, "Missing or invalid Authorization header", 401);
            }
            const token = authHeader.split(" ")[1];
            let decoded;
            try {
                decoded = jwt.verify(token, Config?.JWT_SECRET);
            } catch (err) {
                return Responder.sendFailureMessage(res, "Invalid or expired token", 401);
            }
            const { sub: userId, role: userRole } = decoded;
            if (isEmpty(userId) || isEmpty(userRole)) {
                return Responder.sendFailureMessage(res, "Invalid token payload", 401);
            }
            if (userRole === "user") {
                const users = await UserModel.findById(userId).lean();

                if (isEmpty(users)) {
                    return Responder.sendFailureMessage(res, "User not found or inactive", 401);
                }
                req.body = req?.body || {};
                req.body.logged_user = {
                    id: users?._id,
                    name: users?.name,
                    user_no: users?.user_no,
                    role: users?.role || userRole,
                };
                next();
            } else {
                return Responder.sendFailureMessage(res, "Access denied for this role", 403);
            }
        } catch (error) {
            return Responder.sendFailureMessage(res, "Authentication failed", 500);
        }
    };
};

module.exports = Authentication;
