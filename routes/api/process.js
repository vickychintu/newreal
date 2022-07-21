const counter = require("../../model/counter");
const express = require("express");
const { verifyToken } = require("../../middleware/auth");
const attendance = require("../../model/attendence");
const accounts = require("../../model/accounts");
const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  // console.log("counterapi", req.body);
  const log = req.body;
  const userName = req.user.id;
  log.forEach(async function (data) {
    const { timestamp, date, simId, increment, decrement, id } = data;
    const timeStamp = timestamp;
    const type = increment === 1 ? true : false;
    const simCount = simId;
    let jsDate = date.replaceAll("-", "/");
    jsDate = jsDate.split("/");
    jsDate = new Date(
      new Date(jsDate[2], jsDate[1] - 1, jsDate[0]).setHours(0, 0, 0, 0) +
        330 * 60000
    );
    try {
      const updateTime = new Date(timeStamp);
      const simCounter = {
        entryTimeDate: updateTime,
        entryDateTimestamp: new Date(timeStamp).getTime(),
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
      // if (counterValidate?.simCounter <= 0 && type === false) {
      //   res.status(403).json({ msg: "messed data" });
      //   return;
      // }
      // if (
      //   counterValidate &&
      //   counterValidate.decrements >= counterValidate.increments &&
      //   type === false
      // ) {
      //   res.status(404).json({ msg: "increments cannot exceed decrements" });
      //   return;
      // } else if (counterValidate === null && type === false) {
      //   res.status(403).json({ msg: "cannot decrement zero" });
      //   return;
      // }

      // if (simCount > validateSimCount.simCount) {
      //   res.status(403).json({ msg: "sim number does not exist" });
      //   return;
      // }

      const update2 = {
        $setOnInsert: { startTiz: updateTime },
        startStatus: true,
      };
      let update, update3, update4;
      if (type === true) {
        update = {
          $push: { simCounter: simCounter },
          $inc: { increments: 1, ridesCount: 1 },
        };
        update3 = { $inc: { totalTicketsSold: 1 } };
      } else if (type === false) {
        query.ridesCount = { $gt: 0 };
        query3.simCount = { $gt: 0 };
        update = {
          $push: { simCounter: simCounter },
          $inc: { decrements: 1, ridesCount: -1 },
        };
        update3 = { $inc: { totalTicketsSold: -1 } };
      } else {
        res.status(400).json({
          msg: "invalid type",
          code: 403,
        });
        return;
      }

      const options = { upsert: true, new: true, runValidators: true };
      const attend = await attendance.findOneAndUpdate(
        query2,
        update2,
        options
      );
      if (!attend.finalStatus) {
        const count = await counter.findOneAndUpdate(query, update, options);
        console.log(count);
        const userUpdate = await accounts.findOneAndUpdate(
          query3,
          update3,
          options
        );
        res.status(200).json({
          msg: "counter updated",
          simNumber: count.simCount,
          totalCount: count.increments - count.decrements,
        });
        return;
      } else {
        res.status(403).json({
          msg: "cannot inc/dec ,data is finalized",
        });
        return;
      }
    } catch (e) {
      console.log(e);
      res.status(500).send("server error");
    }
  });
});
module.exports = router;
