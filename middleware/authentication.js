const { validateToken } = require("../services/authenticate");

const checkForAuthenticationCookie = (cookieName) => {
  return (req, res, next) => {
    const cookieValue = req.cookies[cookieName];

    if (!cookieValue) {
      return next();
    }

    try {
      const userPayload = validateToken(cookieValue);
      req.user = userPayload;
      return next();
    } catch (error) {}
    return next();
  };
};

module.exports = checkForAuthenticationCookie;
