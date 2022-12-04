const mongoose = require("mongoose");
const dayTemplate = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  dateOffest: {
    type: Number,
    required: true,
  },
  tempData: {
    type: Array,
    required: true,
  },
  dayGraph: {
    type: Array,
    required: true,
  },
  waitTime: {
    type: Number,
    required: true,
  },
  orderTime: {
    type: Number,
    required: true,
  },
  tempalteId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});
module.exports = mongoose.model("daytemplates", dayTemplate);
