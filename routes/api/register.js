const { Router } = require("express");
const express = require("express");
const md5 = require("md5");
const router = express.Router();
const account = require("../../model/accounts");
router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const { userName, password, simCount } = req.body;
    console.log(userName, password, simCount);
    const userAccount = new account({
      UserName: userName,
      password: md5(password),
      simCount: simCount,
      totalTicketsSold: 0,
    });
    await userAccount.save();
    res.status(200).json({ msg: "successfully registered" });
  } catch (e) {
    res.status(400).json({ msg: "invalid body", code: 401 });
    console.log(e);
  }
});
module.exports = router;
