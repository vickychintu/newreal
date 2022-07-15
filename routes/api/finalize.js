const express = require("express");
const { verifyToken } = require("../../middleware/auth");
const accounts = require("../../model/accounts");
const attendance = require("../../model/attendence");
const router = express.Router();
router.post("/", verifyToken, async (req, res) => {
  try {
    const UserName = req.user.id;
    const { today, currentTime } = req.body;
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
    res.status(404).json({ msg: "err could not update" });
  }
});
module.exports = router;
