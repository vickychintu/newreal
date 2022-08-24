const express = require("express");
const locationLogs = require("../../../model/locationLogs");
const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const { employeeId, locationId } = req.body;
    const addUser = locationLogs
      .update(
        { locationUserName: locationId },
        { $push: { LocationUsers: employeeId } }
      )
      .exec((err, docs) => {
        console.log(docs);
      });
    res.status(200).json({ msg: "successfully" });
  } catch (e) {
    res.status(408).json({ msg: "some error" });
  }
});
module.exports = router;
