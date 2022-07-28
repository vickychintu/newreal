const counter = require("../../model/counter");
const express = require("express");
const { verifyToken } = require("../../middleware/auth");
const attendance = require("../../model/attendence");
const accounts = require("../../model/accounts");
const conformLog = require("../../model/conformLog");
const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  const log = req.body;
  const userName = req.user.id;
  var responseValue = [];
  const resArray = log.map(async (data, index) => {
    const { timestamp, date, simId, increment, decrement, id, pushId } = data;
    console.log(timestamp);
    const timeStamp = new Date(timestamp);
    const type = increment === 1 ? true : false;
    console.log(type);
    const simCount = simId;
    const tempDate = new Date(timeStamp);
    const jsDate = new Date(tempDate.setHours(0, 0, 0, 0) + 19800000);
    try {
      const simCheck = await accounts.findOne({ UserName: userName });
      if (simCheck) {
        console.log(simCheck);
        if (!simCheck.simCount.includes(simId)) {
          console.log("simId does not exist in ");
          return;
        }
      }
      const updateTime = new Date(timeStamp.getTime() + 19800000);
      const simCounter = {
        entryTimeDate: updateTime,
        entryDateTimestamp: timeStamp.getTime(),
        increment: type,
      };

      let query = {
        userName: userName,
        simCount: simCount,
        entryDate: jsDate,
      };

      const query2 = { UserName: userName, forDay: jsDate };
      let query3 = { UserName: userName };
      const validateSimCount = await accounts.findOne(query3);
      const counterValidate = await counter.findOne(query);
      if (!validateSimCount.simCount.includes(simCount)) {
        console.log("sim is not valid");
        return;
      }
      const logCheck = await conformLog.updateOne(
        { UserName: userName, uniqueID: pushId },
        { date: jsDate },
        { upsert: true }
      );
      if (!logCheck.upsertedId) {
        responseValue.push(pushId);
        console.log("already done");
        return;
      }
      const update2 = {
        $setOnInsert: { startTiz: updateTime },
        startStatus: true,
      };
      let update, update3, update4;
      if (type === true) {
        console.log("incremenmenting");
        update = {
          $push: { simCounter: simCounter },
          $inc: { increments: 1, ridesCount: 1 },
        };
        update3 = { $inc: { totalTicketsSold: 1 } };
      } else if (type === false) {
        console.log("decrementing");
        update = {
          $push: { simCounter: simCounter },
          $inc: { decrements: 1, ridesCount: -1 },
        };
        update3 = { $inc: { totalTicketsSold: -1 } };
      } else {
        console.log("not even reaching the finalized check");
        return;
      }

      const options = { upsert: true, new: true };
      const attend = await attendance.findOneAndUpdate(
        query2,
        update2,
        options
      );
      if (!attend.finalStatus) {
        const count = await counter.findOneAndUpdate(query, update, options);
        const userUpdate = await accounts.findOneAndUpdate(
          query3,
          update3,
          options
        );
        console.log(count, userUpdate);
        responseValue.push(pushId);
        return;
      } else {
        console.log("already finalized ");
        return;
      }
    } catch (e) {
      console.log(e);
      return;
    }
  });
  return Promise.all(resArray).then(() => {
    res.status(200).json({ data: responseValue });
  });
});
module.exports = router;
