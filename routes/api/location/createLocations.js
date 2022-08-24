const express = require("express");
const locationLogs = require("../../../model/locationLogs");
const router = express.Router();

router.post("/", async (req, res) => {
  const { locationName, userName, phoneNumber } = req.body;
  LocationIdGenerator(locationName);
  const createLocation = new locationLogs({
    LocationId: LocationIdGenerator(locationName),
    LocationUserName: userName,
    LocationName: locationName,
    LocationPhNumber: phoneNumber,
  });
  createLocation.save();
  res.status(200).json({ msg: "registered successfully" });
});
const LocationIdGenerator = (locationName) => {
  try {
    const cityNum = 1;
    const registrationDate = new Date();
    const year = registrationDate.getYear();
    const month = registrationDate.getMonth();
    const possibleIds = locationName.split(/(?=[A-Z\s\d])/);
    var middleKey;
    switch (possibleIds.length) {
      case 1:
        middleKey = possibleIds[0].slice(0, 2);
        break;
      case 2:
        middleKey = possibleIds[0][0] + possibleIds[1][0];
        break;
    }
    const finalString = cityNum + middleKey + year + month;
    console.log(finalString);
    return finalString;
  } catch (e) {
    console.log(e);
    return false;
  }
};
module.exports = router;
