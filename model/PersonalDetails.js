const mongoose = require("mongoose");
const UserPersonalDetails = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  designation: {
    type: String,
    required: true,
  },
  employedStatus: {
    type: Boolean,
    required: true,
  },
});
module.exports = mongoose.model("personalDetails", UserPersonalDetails);
