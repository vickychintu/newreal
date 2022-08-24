onst { hash } = require("bcryptjs");
const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  skqName: {
    type: String,
    required: true,
  },
  price: {
    type: number,
    required: true,
  },
  gymId: {
    type: hash,
    required: true,
  },
  machineId: {
    type: hash,
    required: true,
  },
  offerPercent: {
    type: number,
    required: true,
  },
});

module.exports = mongoose.model("AssociatedBrands", UserSchema);
