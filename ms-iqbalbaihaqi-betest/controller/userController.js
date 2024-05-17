const UserServices = require("../services/user");

class UserController {
  static async create(req, res, next) {
    try {
      const userData = {
        userName: req.body.userName,
        emailAddress: req.body.emailAddress,
        accountNumber: req.body.accountNumber,
        identityNumber: req.body.identityNumber,
      };

      // check duplicate data
      await UserServices.isDuplicate(userData);

      const newContact = await UserServices.createUser(userData);

      res.status(201).json({
        success: true,
        message: "User created",
        data: newContact,
      })
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController
