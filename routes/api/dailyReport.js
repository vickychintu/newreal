//
const express = require("express");
const { verifyToken } = require("../../middleware/auth");
const counter = require("../../model/counter");
const router = express.Router();
//
router.post("/", verifyToken, async (req, res) => {
  const UserName = req.user.id;
  const { date } = req.body;
  console.log(UserName, new Date(date + 19800000).toISOString());
  const graphData = await counter
    .aggregate([
      {
        $match: {
          userName: UserName,
          entryDate: new Date(date + 19800000),
        },
      },
      {
        $group: {
          _id: {
            simCount: "$simCount",
          },
          countValue: {
            $push: { simCounter: "$simCounter", ridesCount: "$ridesCount" },
          },
        },
      },
    ])
    .then((result) => {
      let graphData = {};
      result.map((val, index) => {
        let tempObject = {};
        tempObject.ridesCount = val.countValue[0].ridesCount;
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
        tempObject.hourGraph = hourGraph;
        graphData[val._id.simCount] = tempObject;
      });
      console.log(graphData);
      res.status(200).json({ data: graphData });
    })
    .catch((error) => {
      console.log(error);
    });
});

//Export the API route
module.exports = router;
