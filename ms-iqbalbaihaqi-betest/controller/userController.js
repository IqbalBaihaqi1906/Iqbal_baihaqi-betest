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

  static async findAll(req, res, next) {
    try {
      const users = await UserServices.findAll();

      if (users.length === 0) {
        const error = new Error("No Users Found");
        error.code = 404;
        throw error;
      }

      res.status(200).json({
        success: true,
        message: "Users Found",
        data: users,
      })
    } catch (error) {
      next(error);
    }
  }

  static async findOne(req, res, next) {
    try {
      const { id } = req.params

      const user = await UserServices.findOneById(id);

      res.status(200).json({
        success: true,
        message: "User found",
        data: user,
      })
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params

      const userData = {
        userName: req.body.userName,
        emailAddress: req.body.emailAddress,
        accountNumber: req.body.accountNumber,
        identityNumber: req.body.identityNumber,
      };

      await UserServices.isDuplicate(userData, id);

      const user = await UserServices.updateOne(id, userData);

      res.status(200).json({
        success: true,
        message: "User updated",
        data: user,
      })
    } catch (error) {
      next(error);
    }
  }

  static async deleteOne(req, res, next) {
    try {
      const { id } = req.params

      const user = await UserServices.deleteOne(id);

      res.status(200).json({
        success: true,
        message: "User deleted",
        data: user,
      })
    } catch (error) {
      next(error);
    }
  }

  static async findByIdentityNumber(req, res, next) {
    try {
      const { identityNumber } = req.params

      const user = await UserServices.findByIdentityNumber(identityNumber);

      if (!user) {
        const customError = new Error("User not found!");
        customError.code = 404;
        throw customError;
      }

      res.status(200).json({
        success: true,
        message: "User found",
        data: user,
      })
    } catch (error) {
      next(error);
    }
  }

  static async findByAccountNumber(req, res, next) {
    try {
      const { accountNumber } = req.params

      const user = await UserServices.findByAccountNumber(accountNumber);

      if (!user) {
        const customError = new Error("User not found!");
        customError.code = 404;
        throw customError;
      }

      res.status(200).json({
        success: true,
        message: "User found",
        data: user,
      })
    } catch (error) {
      next(error);
    }
  }

  static async generateToken(req, res, next) {
    try {
      const token = await UserServices.generateToken();

      res.status(200).json({
        success: true,
        message: "Token generated",
        data: token,
      })
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController
