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
}

module.exports = UserServices;