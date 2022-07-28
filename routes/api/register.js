const { Router } = require("express");
const express = require("express");
const md5 = require("md5");
const router = express.Router();
const account = require("../../model/accounts");
var ObjectID = require("mongodb").ObjectID;
router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const { userName, password, simCount } = req.body;
    console.log(userName, password, simCount);
    const id = validatorIdGenerator(userName);
    console.log(id);
    const userAccount = new account({
      UserName: userName,
      AssociatedUserId: new ObjectID(),
      password: md5(password),
      simCount: simCount,
      totalTicketsSold: 0,
      validationID: id,
    });
    await userAccount.save();
    res.status(200).json({ msg: "successfully registered" });
  } catch (e) {
    res.status(400).json({ msg: "invalid body", code: 401 });
    console.log(e);
  }
});
const validatorIdGenerator = (userName) => {
  const date = Date.now();
  const id = md5(`${date}${userName}`);
  console.log(id);
  return id;
};
module.exports = router;
