const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  LocationId: {
    type: String,
    required: true,
    unique: true,
  },
  LocationUserName: {
    type: String,
    required: true,
    unique: true,
  },
  LocationName: {
    type: String,
    required: true,
    unique: true,
  },
  LocationPhNumber: {
    type: Number,
    required: true,
  },
  spreedSheetId: {
    type: String
  },
  LocationUsers: {
    type: Array,
    default: [],
  },
});
module.exports = mongoose.model("tehoLocations", UserSchema);
