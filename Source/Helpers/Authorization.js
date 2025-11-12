const Responder = require("../App/Responder");

const Authorize = (roles) => {

  if (typeof roles === "string") roles = [roles];

  return (req, res, next) => {
    const role = req?.body?.logged_user?.role;
    if (!role || !roles.includes(role)) {
      return Responder.sendFailureMessage(res, "Access denied: insufficient permissions", 403);
    }

    next();
  };
};

module.exports = Authorize;