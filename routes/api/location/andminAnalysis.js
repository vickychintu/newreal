const express = require("express");
const mongoose = require("mongoose");
const counter = require("../../../model/counter");
const locationLogs = require("../../../model/locationLogs");
const router = express.Router();
router.post("/", async (req, res) => {
  // console.log(req);
  const { locationId, date } = req.body;
  console.log(date);
  const tempDate = new Date(date);
  tempDate.setHours(0);
  tempDate.setMinutes(0);
  tempDate.setSeconds(0);
  tempDate.setMilliseconds(0);
  // console.log(tempDate);
  const formattedDate = new Date(tempDate).getTime();
  const completeDate = new Date(formattedDate + 19800000 * 2);
  // console.log(completeDate, locationId);
  let employees = [];
  locationLogs
    .findOne({ _id: mongoose.Types.ObjectId(locationId) })
    .exec(async (err, docs) => {
      // console.log(err);
      if (err) {
        res.status(404).json({ msg: "internal error" });
      } else if (docs) {
        employees = docs.LocationUsers;
        const graphData = await counter
          .aggregate([
            {
              $match: {
                userName: { $in: employees },
                entryDate: completeDate,
              },
            },
            {
              $group: {
                _id: {
                  simCount: "$simCount",
                },
                countValue: {
                  $push: {
                    simCounter: "$simCounter",
                    ridesCount: "$ridesCount",
                    userName: "$userName",
                  },
                },
              },
            },
          ])
          .then((result) => {
            console.log(result[0]);
            let graphData = {};
            result.map((val, index) => {
              let tempObject = {};
              if (val.countValue.length > 1) {
                tempObject.ridesCount =
                  val.countValue[0].ridesCount + val.countValue[1].ridesCount;
              } else {
                tempObject.ridesCount = val.countValue[0].ridesCount;
              }

              var hourGraph = Array(2)
                .fill(null)
                .map(() => Array(24).fill(0));
              val.countValue[0].simCounter.map((val, index) => {
                new Date(val.entryDateTimestamp - 330 * 60000).getHours();
                const hour = new Date(
                  val.entryDateTimestamp - 330 * 60000
                ).getHours();
                if (val.increment === true) {
                  hourGraph[0][hour]++;
                } else if (val.increment === false) {
                  hourGraph[1][hour]++;
                }
              });
              if (val.countValue.length > 1) {
                val.countValue[1].simCounter.map((val, index) => {
                  new Date(val.entryDateTimestamp - 330 * 60000).getHours();
                  const hour = new Date(
                    val.entryDateTimestamp - 330 * 60000
                  ).getHours();
                  if (val.increment === true) {
                    hourGraph[0][hour]++;
                  } else if (val.increment === false) {
                    hourGraph[1][hour]++;
                  }
                });
              }

              tempObject.hourGraph = hourGraph;
              graphData[val._id.simCount] = tempObject;
            });
            console.log(graphData);
            res.status(200).json({ data: graphData });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
});
module.exports = router;
