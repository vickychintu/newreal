const express = require("express");
const md5 = require("md5");
const { generateToken, verifyToken } = require("../../middleware/auth");
const router = express.Router();
const account = require("../../model/accounts");
router.post("/", (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  const hashedPassword = password && md5(password);
  console.log(hashedPassword);
  account.findOne(
    {
      UserName: username,
      password: hashedPassword,
    },
    (err, docs) => {
      console.log(docs);
      const jwt = generateToken(username);
      if (docs) {
        res.status(200).json({
          msg: "logged in successfully",
          token: jwt,
          simCount: docs.simCount,
        });
      } else {
        res
          .status(401)
          .json({ msg: "username and password does not match", code: 7 });
      }
    }
  );
});
router.get("/verify", verifyToken, (req, res) => {
  account.findOne(
    {
      userName: req.user.id,
    },
    "-_id -__v -password -userId ",
    (err, docs) => {
      console.log(err);
      if (err) {
        res.status(403).json({ err: "database error" });
      } else if (docs) {
        res
          .status(200)
          .json({ msg: "logged in successfully", userDetails: docs });
      } else {
        res.status(401).json({ msg: "user does not exist" });
      }
    }
  );
});

module.exports = router;
