const mongoose = require("mongoose");
const simulationData = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  templateArray: {
    type: Array,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  weekVolume: {
    type: Array,
    required: true,
  },
  hourArray: {
    type: Array,
    required: true,
  },
  orderHourArray: {
    type: Array,
    required: true,
  },
  jsonLocation: {
    type: Array,
    required: true,
  },
  jsonLength: {
    type: Array,
    required: true,
  },
  spanData: {
    type: Array,
    requiored: true,
  },
  completeDispersionData: {
    type: Array,
    required: true,
  },
  apiEndPoint: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("simTemplates", simulationData);
