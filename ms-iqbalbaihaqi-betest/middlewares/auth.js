const jwt = require("jsonwebtoken");

class Authentication {
  static userAuthentication(req, res, next) {
    try {
      const { authorization } = req.headers;

      if (!authorization) {
        const customError = new Error("Missing authorization header!");
        customError.code = 401;
        throw customError;
      }

      if (!authorization.startsWith("Bearer")) {
        const customError = new Error("Invalid authorization header!");
        customError.code = 401;
        throw customError;
      }

      const decodedToken = jwt.verify(authorization.split(" ")[1], process.env.JWT_SECRET);

      if (!decodedToken) {
        const customError = new Error("Invalid token!");
        customError.code = 401;
        throw customError;
      }
      
      if (decodedToken.isValidUser !== true) {
        const customError = new Error("Invalid user!");
        customError.code = 401;
        throw customError;
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Authentication;
