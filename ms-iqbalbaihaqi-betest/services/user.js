const jwt = require("jsonwebtoken");
const User = require("../models/User");
const redis = require('../connection/redis');

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

      this.clearCache();

      return newContact._id;
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const cachedUsers = await redis.get('users');

      if (cachedUsers) {
        return JSON.parse(cachedUsers);
      }

      const users = await User.find();

      if(users.length > 0) {
        await redis.set('users', JSON.stringify(users), 'EX', 3600);
      }

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
      const cachedUser = await redis.get(`user-id:${id}`);

      if (cachedUser) {
        return JSON.parse(cachedUser);
      }

      const user = await User.findById(id);

      if (!user) {
        const customError = new Error("User not found!");
        customError.code = 404;
        throw customError;
      }

      await redis.set(`user-id:${id}`, JSON.stringify(user), 'EX', 3600);

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

      this.clearCache(id);

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

      this.clearCache(id)

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

  static async clearCache(id = null) {
    try {
      if (id) {
        await redis.del(`user-id:${id}`);
      }
      await redis.del('users');
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