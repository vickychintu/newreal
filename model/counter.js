const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  simCount: {
    type: String,
    required: true,
  },
  entryDate: {
    type: Date,
    required: true,
  },
  finalizeDateTime: {
    type: Date,
  },
  finalizedStatus: {
    type: Boolean,
    required: true,
    default: false,
  },
  increments: {
    type: Number,
    required: true,
    default: 0,
  },
  decrements: {
    type: Number,
    required: true,
    default: 0,
  },
  ridesCount: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  simCounter: [
    {
      entryTimeDate: Date,
      entryDateTimestamp: Number,
      increment: Boolean,
    },
  ],
});

module.exports = mongoose.model("counter", UserSchema);
