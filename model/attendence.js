const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
  UserName: {
    type: String,
    required: true,
  },
  startStatus: {
    type: Boolean,
    required: true,
    default: true,
  },
  forDay: {
    type: Date,
    required: true,
  },
  finalStatus: {
    type: Boolean,
    required: true,
    default: false,
  },
  startTiz: {
    type: Date,
  },
  finalize: {
    type: Date,
  },
});
module.exports = mongoose.model("attendance", UserSchema);
