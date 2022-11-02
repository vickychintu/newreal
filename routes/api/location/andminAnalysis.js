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
router.post("/monthWise", (req, res) => {
  const { locationId, month, year } = req.body;
  locationLogs
    .findOne({ _id: mongoose.Types.ObjectId(locationId) })
    .exec(async (err, docs) => {
      // console.log(err);
      if (err) {
        console.log(err);
        res.status(404).json({ msg: "internal error" });
      } else if (docs) {
        employees = docs.LocationUsers;
        const graphData = await counter
          .aggregate([
            {
              $addFields: {
                month: { $month: "$entryDate" },
                year: { $year: "$entryDate" },
              },
            },
            {
              $match: {
                userName: { $in: employees },
                month: month,
                year: year,
              },
            },
            {
              $group: {
                _id: {
                  entryDate: "$entryDate",
                },
                countValue: {
                  $sum: "$ridesCount",
                },
              },
            },
          ])
          .then((result) => {
            let monthArray = new Array(31).fill(0);
            console.log(result);
            result.map((docs) => {
              const date = new Date(docs._id.entryDate);
              monthArray[date.getDate() - 1] = docs.countValue;
              console.log(date.getDate(), docs.countValue);
            });
            res.status(200).json(monthArray);
            console.log(monthArray);
          })
          .catch((error) => {
            res.status(400).json({ msg: "internal server error" });
            console.log(error);
          });
      }
    });
});

router.post("/average", async (req, res) => {
  try {
    const { locationId, month, year, isAllTime } = req.body;
    var lastDayOfMonth = new Date(year, month, 0).getDate();
    let result = [];
    result = await counter.aggregate([
      {
        $match: !isAllTime
          ? {
              entryDate: {
                $gte: new Date(
                  `${year}-${
                    month > 9 ? month : "0" + String(month)
                  }-01T05:30:00Z`
                ),
                $lte: new Date(
                  `${year}-${
                    month > 9 ? month : "0" + String(month)
                  }-${lastDayOfMonth}T05:30:00Z`
                ),
              },
            }
          : {},
      },
      {
        $group: {
          _id: { $dayOfWeek: { date: "$entryDate" } },
          totalRides: { $sum: "$ridesCount" },
        },
      },
    ]);

    let data = {};
    data.sumRides = 0;
    result.map((item) => {
      data[item._id] = item.totalRides;
      data.sumRides += item.totalRides;
    });
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(503).json("Internal Server Error!");
  }
});
module.exports = router;
