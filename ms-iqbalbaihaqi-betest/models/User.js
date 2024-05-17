const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  accountNumber: {
    type: String,
    required: [true, "Account number is required"],
    unique: true,
  },
  emailAddress: {
    type: String,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter a valid email"
    },
    required: [true, "Email is required"]
  },
  identityNumber: {
    type: String,
    required: [true, "Identity number is required"],
    unique: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);