const express = require("express");
const { verifyToken } = require("../../middleware/auth");
const accounts = require("../../model/accounts");
const attendance = require("../../model/attendence");
const counter = require("../../model/counter");
const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try{
 const userName = req.user.id;
  const { date } = req.body;
  console.log(userName,date);
  const simCount = await accounts.findOne(
    { UserName: userName },
    "-_id simCount"
  );
  const attend = await attendance.count({
    userName: userName,
    entryDate: date,
    finalStatus: true,
  });
  let finalized = false;

  const counts = counter
    .find({ userName: userName, entryDate: date })
    .exec((err, docs) => {
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
  }
  catch(e){
    res.status(500).json({msg:"server error"})
  }
 
});

module.exports = router;
