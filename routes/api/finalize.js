const express = require("express");
const { verifyToken } = require("../../middleware/auth");
const accounts = require("../../model/accounts");
const attendance = require("../../model/attendence");
const router = express.Router();
router.post("/", verifyToken, async (req, res) => {
  try {
    const UserName = req.user.id;
    let { forDay, currentTime } = req.body;
    console.log(forDay, currentTime);
    const timeStamp = new Date(currentTime);
    forDay = forDay.split("-");
    var date = forDay[0];
    var mon = forDay[1];
    var year = forDay[2];
    forDay = mon + "/" + date + "/" + year;
    console.log(forDay);

    const tempTime = new Date(forDay);
    const today = new Date(tempTime.setHours(0, 0, 0, 0) + 19800000);
    console.log(today, currentTime);
    const bikas = await attendance.findOneAndUpdate(
      { UserName: UserName, forDay: today, finalStatus: false },
      { finalStatus: true, finalize: currentTime }
    );
    if (bikas) {
      res.status(200).json({ msg: "finalized successfully" });
    } else {
      res.status(400).json({ msg: "fuck off", code: 700 });
    }
  } catch (e) {
    console.log(e.message);
    res.status(404).json({ msg: "err could not update" });
  }
});
module.exports = router;
