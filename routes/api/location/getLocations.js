const express = require("express");
const locationLogs = require("../../../model/locationLogs");
const router = express.Router();
router.get("/", async (req, res) => {
  await locationLogs.find({}, "-LocationId -__v").exec((err, docs) => {
    if (err) {
      res.status(406).json({ msg: "server error" });
    }
    if (docs) {
      res.status(200).json(docs);
    }
  });
});
module.exports = router;
