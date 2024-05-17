const jwt = require("jsonwebtoken");
const User = require("../models/User");

class UserServices {
  static async createUser(userData) {
    try {
      const user = new User({
        userName: userData.userName,
        emailAddress: userData.emailAddress,
        accountNumber: userData.accountNumber,
        identityNumber: userData.identityNumber,
      });

      const newContact = await user.save();
      return newContact._id;
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const users = await User.find();

      return users;
    } catch (error) {
      throw error;
    }
  }

  static async isDuplicate(userData, updateId = null) {
    try {
      const duplicateFields = [];
      const user = await User.findOne({
        $or: [
          { userName: userData.userName },
          { emailAddress: userData.emailAddress },
          { accountNumber: userData.accountNumber },
          { identityNumber: userData.identityNumber },
        ]
      });

      if (user && user._id.toString() !== updateId) {
        Object.keys(userData).forEach(key => {
          if (user[key] === userData[key]) {
            duplicateFields.push(key);
          }
        });

        const duplicateError = new Error(`Duplicate data found: ${duplicateFields.join(", ")} already exists`);
        duplicateError.code = 400;
        throw duplicateError;
      }
    } catch (error) {
      throw error;
    }
  }

  static async findOneById(id) {
    try {
      const user = await User.findById(id);

      if (!user) {
        const customError = new Error("User not found!");
        customError.code = 404;
        throw customError;
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async updateOne(id, userData) {
    try {
      const user = await User.findByIdAndUpdate(id, userData);

      if (!user) {
        const customError = new Error("User not found!");
        customError.code = 404;
        throw customError;
      }

      return user._id;
    } catch (error) {
      throw error;
    }
  }

  static async deleteOne(id) {
    try {
      const user = await User.findByIdAndDelete(id);

      if (!user) {
        const customError = new Error("User not found!");
        customError.code = 404;
        throw customError;
      }

      return user._id;
    } catch (error) {
      throw error;
    }
  }

  static async findByIdentityNumber(identityNumber) {
    try {
      const user = await User.findOne({
        identityNumber,
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async findByAccountNumber(accountNumber) {
    try {
      const user = await User.findOne({
        accountNumber,
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async generateToken() {
    try {
      const authorizationToken = jwt.sign({ isValidUser: true }, process.env.JWT_SECRET);

      return authorizationToken;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserServices;