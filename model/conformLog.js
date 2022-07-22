const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  UserName: {
    type: String,
    required: true,
  },
  uniqueID: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    required: true,
  },
});
module.exports = mongoose.model("uploadLogs", UserSchema);
