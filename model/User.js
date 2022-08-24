const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: Number,
    required: String,
  },
  emailId: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: Number,
    required: true,
  },
  dob: {
    type: Date,
    required: false,
  },
  TokenBal: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("user", UserSchema);
