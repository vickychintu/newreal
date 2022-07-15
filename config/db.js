const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");
const connectDB = async () => {
  console.log(db);
  try {
    await mongoose.connect(db);
    console.log("...MongoDB connected");
  } catch (e) {
    console.log(`error in connection ${e.message}`);
    //exit process with failure
    process.exit(1);
  }
};
module.exports = connectDB;
