/*
  this is the main script from which nodeJs execution will start
  created by :Subramanian K 
  created at :232/11/2022
*/
const express = require("express");
const connectDB = require("./config/db");
const app = express();
const fs = require("fs");
const trialJsons = require("./uploads/trial.json");
const formidable = require("formidable");
const simTemplate = require("./model/simTemplate");
const { timeStamp } = require("console");
connectDB();
app.use(express.json({ extended: false }));
const cors = require("cors");
const dayTemplates = require("./model/dayTemplates");
const { mongoose, Schema, Mongoose } = require("mongoose");
const ObjectId = require("mongodb").ObjectId;

app.use(
  cors({
    origin: "*",
  })
);

const PORT = process.env.PORT || 8000;
app.get("/backend", (req, res) => {
  res.send("API Running");
});
app.post("/generateData", (req, res) => {
  var form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    let {
      startDate,
      endDate,
      template,
      weekArray,
      hourData,
      apiEndPoint,
      orderTime,
      waitTime,
    } = fields;
    weekArray = JSON.parse(weekArray);
    hourData = JSON.parse(hourData);
    orderTime = parseInt(orderTime);
    waitTime = parseInt(waitTime);

    const hourArray = randomizer(hourData, weekArray, startDate, endDate);
    var rawData = fs.readFileSync(files.file.filepath);

    fs.writeFile(
      `../uploads/${files.file.newFilename}.json`,
      rawData,
      (err, data) => {
        if (err) {
          res.status(407);
          return;
        }
        const testData = require(`../uploads/${files.file.newFilename}.json`);
        const spanData = randomOrderPicker(hourArray, testData.length);
        let completeDispersionData = [];
        hourArray.map((x, i) => {
          completeDispersionData.push(mapRandomData(x));
        });
        if (Array.isArray(testData)) {
          simTemplate
            .insertMany({
              name: template,
              templateArray: hourData,
              startDate: startDate,
              endDate: endDate,
              weekVolume: weekArray,
              hourArray: hourArray,
              jsonLocation: `../uploads/${files.file.newFilename}.json`,
              jsonLength: testData.length,
              spanData: spanData,
              apiEndPoint: apiEndPoint,
              completeDispersionData: completeDispersionData,
              // orderTime,
              // waitTime,
              orderHourArray: v2DisperseData.orderDayArray,
            })
            .then((response) => {
              res.status(200).json({ msg: "sucessfull" });
              return;
            })
            .catch((err) => {
              if (err.code == 11000) {
                res.status(204).json({ msg: "template name must be unique" });
                return;
              }
              res.status(407).json({ msg: "failure" });
              return;
            });
        } else {
          res.status(205).json({ msg: "file must contain an array of jsons" });
          return;
        }
      }
    );
  });
});
const splitOrders = () => {};
const randomOrderPicker = (hourData, jsonVolume) => {
  let spanArray = [];
  hourData.map((x, i) => {
    let dayArray = [];
    x.map((x) => {
      let hourArray = [];
      for (let i = 0; i < x; i++) {
        hourArray.push(randomInteger(1, jsonVolume));
      }
      dayArray.push(hourArray);
    });
    spanArray.push(dayArray);
  });
  return spanArray;
};
const randomizer = (hourArray, weekArray, startDate, endDate) => {
  const nstartDate = new Date(startDate);
  const nendDate = new Date(endDate);
  const numberofDays = dayDiff(nstartDate, nendDate);
  let completeHourArray = [];
  for (let i = 0; i < numberofDays; i++) {
    const requiredDay = getdayofWeek(nstartDate, i);
    const newHourRatio = genrateRandomHours(hourArray, weekArray[requiredDay]);
    completeHourArray.push(newHourRatio);
  }
  return completeHourArray;
};
app.post("/getTempalteData", (req, res) => {
  const { templateName } = req.body;
  simTemplate
    .find({ name: templateName })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(404).json({ msg: "failed" });
    });
});
const genrateRandomHours = (hourArray, weekVolume) => {
  let alterdHourRatio = [];
  let sum = 0;
  if (Array.isArray(hourArray)) {
    hourArray.map((x, i) => {
      alterdHourRatio.push(x * (randomInteger(75, 125) / 100));
      sum = sum + alterdHourRatio[i];
    });
  }

  const coeffecient = weekVolume / sum;
  alterdHourRatio = alterdHourRatio.map((x) => {
    return Math.ceil(x * coeffecient);
  });
  return alterdHourRatio;
};
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const getdayofWeek = (startDate, i) => {
  const initialDate = new Date(startDate);
  initialDate.setDate(initialDate.getDate() + i);
  return initialDate.getDay();
};
const dayDiff = (startDate, endDate) => {
  var Difference_In_Time = endDate.getTime() - startDate.getTime();
  var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  return Difference_In_Days;
};
app.post("/interHourData", (req, res) => {
  const { hourArray, spanData } = req.body;
  let interHourArray = [];
  hourArray.map((x, i) => {
    generateCompleteRandom(x).map((y, j) => {
      let graphObject = { x: i, y, z: spanData[i][j] };
      interHourArray.push(graphObject);
    });
  });
  res.status(200).json(interHourArray);
});
app.post("/interHourDataV2", (req, res) => {
  let interHourArray = [];
  const { hourArray, spanData } = req.body;
  hourArray.map((x, i) => {
    if (x.length == 0) {
      return;
    }
    x.map((y, j) => {
      let graphObject = {
        x: i,
        y: y / 60,
        z: spanData[i][j],
      };
      interHourArray.push(graphObject);
    });
  });
  res.status(200).json(interHourArray);
});
app.post("/savesubTemplate", async (req, res) => {
  try {
    let interHourArray = [];
    let orderHourArray = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
    const {
      hourArray,
      spanData,
      waitTime,
      orderTime,
      templateId,
      tempName,
      dateOffest,
    } = req.body;
    console.log("entring array");
    const dispersionData = generatecomprehensiveData(
      hourArray,
      orderTime,
      spanData,
      waitTime
    );
    dispersionData.map((x, i) => {
      if (x.orderCompleted) {
        let graphObject = {
          x: x.orderHours,
          y: x.orderSeconds / 60,
          z: x.jsonId,
        };
        orderHourArray[x.orderHours]++;
        interHourArray.push(graphObject);
      }
    });
    console.log("awaiting data");
    await dayTemplates.insertMany({
      name: tempName,
      dateOffest: dateOffest,
      tempData: dispersionData,
      dayGraph: orderHourArray,
      waitTime: waitTime,
      orderTime: orderTime,
      tempalteId: ObjectId(templateId),
    });
    res.status(200).json({ msg: "sucess" });
  } catch (e) {
    console.log(e);
    res.status(407).json({ msg: "err" });
  }
});
const generatecomprehensiveData = (
  dispersionData,
  orderTime,
  spanData,
  waitTime
) => {
  orderTime = parseInt(orderTime);
  waitTime = parseInt(waitTime);
  let orderHourArray = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];
  let interHourArray = [];
  let nextPossibleTime = 0;
  dispersionData.map((x, i) => {
    if (x.length > 0) {
      x.map((y, j) => {
        if (3600 * i + y >= nextPossibleTime) {
          let graphObject = {
            arrivalHours: i,
            arriavalSeconds: y,
            orderHours: i,
            orderSeconds: y,
            jsonId: spanData[i][j],
            orderCompleted: true,
          };
          interHourArray.push(graphObject);
          nextPossibleTime = 3600 * i + y + orderTime;
          orderHourArray[i]++;
        } else {
          let nextValue = nextPossibleTime % 3600;
          if (
            (nextPossibleTime - nextValue) / 3600 < 24 &&
            nextPossibleTime <= 3600 * i + y + waitTime
          ) {
            let graphObject = {
              arrivalHours: i,
              arriavalSeconds: y,
              orderHours: (nextPossibleTime - nextValue) / 3600,
              orderSeconds: nextValue,
              jsonId: spanData[i][j],
              orderCompleted: true,
            };
            orderHourArray[(nextPossibleTime - nextValue) / 3600]++;

            interHourArray.push(graphObject);
            nextPossibleTime = nextPossibleTime + orderTime;
          } else {
            let graphObject = {
              arrivalHours: i,
              arriavalSeconds: y,
              orderHours: null,
              orderSeconds: null,
              jsonId: spanData[i][j],
              orderCompleted: false,
            };
            interHourArray.push(graphObject);
          }
        }
      });
    }
  });

  return interHourArray;
};
app.post("/interHourOrderData", (req, res) => {
  try {
    let interHourArray = [];
    let orderHourArray = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
    const { hourArray, spanData, waitTime, orderTime } = req.body;
    const dispersionData = generatecomprehensiveData(
      hourArray,
      orderTime,
      spanData,
      waitTime
    );
    dispersionData.map((x, i) => {
      if (x.orderCompleted) {
        let graphObject = {
          x: x.orderHours,
          y: x.orderSeconds / 60,
          z: x.jsonId,
        };
        orderHourArray[x.orderHours]++;
        interHourArray.push(graphObject);
      }
    });
    res.status(200).json({ interHourArray, orderHourArray: orderHourArray });
  } catch (e) {
    res.status(407);
  }
});
app.post("/req", (req, res) => {});
const generateIntermediates = (span, totalOrders, startTime) => {
  if (totalOrders == 0) {
    return [];
  }
  let hourArray = [];
  const leastCount = span / totalOrders;
  let currentRandom = randomInteger(1, 200) / 100;
  if (totalOrders <= 2) {
    currentRandom = randomInteger(1, 100) / 100;
  }
  let timestamp = currentRandom * leastCount;
  let newSpan = span - timestamp;
  hourArray.push((startTime + timestamp) / 60);
  hourArray.push(
    ...generateIntermediates(newSpan, totalOrders - 1, startTime + timestamp)
  );
  return hourArray;
};
const mapRandomData = (hourArray) => {
  let interHourArray = [];
  hourArray.map((x, i) => {
    interHourArray.push(generateCompleteRandom(x));
  });
  return interHourArray;
};
const generateCompleteRandom = (totalOrders) => {
  if (totalOrders == 0) {
    return [];
  }
  let secondsArray = [];
  let requiredArray = [];
  for (let i = 0; i < totalOrders; i++) {
    let currenOrder = Math.floor(randomInteger(0, 3600));
    requiredArray.push(currenOrder);
  }
  requiredArray.sort((a, b) => a - b);
  return requiredArray;
};

app.listen(PORT, () => {
  console.info(`App listening at http://localhost:${PORT}`);
});
