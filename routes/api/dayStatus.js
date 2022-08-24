const express = require("express");
const { verifyToken } = require("../../middleware/auth");
const accounts = require("../../model/accounts");
const attendance = require("../../model/attendence");
const counter = require("../../model/counter");
const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    const userName = req.user.id;
    const { date } = req.body;
    const reqDate = new Date(date).setHours(0, 0, 0, 0);
    const finDate = new Date(reqDate + 19800000 * 2);
    const finDate2 = new Date(reqDate + 19800000);
    console.log(userName, finDate);
    const simCount = await accounts.findOne(
      { UserName: userName },
      "-_id simCount"
    );
    const attend = await attendance.count({
      userName: userName,
      entryDate: finDate,
      finalStatus: true,
    });
    let finalized = false;

    const counts = counter
      .find({ userName: userName, entryDate: finDate })
      .exec((err, docs) => {
        console.log(docs);
        if (attend == 1) {
          finalized = true;
        }
        let dataObj = {};
        for (i = 1; i <= simCount.simCount; i++) {
          dataObj[i] = 0;
        }
        if (err) {
          res.status(400).json({ msg: "database error" });
        } else if (docs.length === 0) {
          res.status(200).json(dataObj);
        } else {
          docs.map((simData) => {
            dataObj[simData.simCount] = simData.ridesCount;
          });
          dataObj.finalized = finalized;
          console.log(dataObj);
          res.status(200).json(dataObj);
        }
      });
  } catch (e) {
    res.status(500).json({ msg: "server error" });
  }
});
router.get("/", async (req, res) => {
  const { date } = req.query;
  const intdate = parseInt(date);
  const reqDate = new Date(intdate);
  console.log(reqDate);
  const mDate = new Date(reqDate.setHours(0, 0, 0, 0) + 19800000 * 2);
  console.log(mDate);
  await counter.find({ entryDate: mDate }, "-_id -__v").exec((err, docs) => {
    if (docs) {
      console.log(docs);
      res.send(docs);
    } else if (err) {
      res.status(404);
    } else {
      res.status(403).json({ msg: "no data for the given date" });
    }
  });
});
module.exports = router;
