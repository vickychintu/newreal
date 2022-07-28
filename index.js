/*
  this is the main script from which nodeJs execution will start
  created by :Subramanian K 
  created at :17/072022
*/
const express = require("express");
const connectDB = require("./config/db");
const cron = require("node-cron");
const https = require("https");
const app = express();
const fs = require("fs");
const multer = require("multer");
connectDB();
app.use(express.json({ extended: false }));
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);
const PORT = 8000;
app.get("/backend", (req, res) => {
  res.send("API Running");
});
let cornString = "32 16 * * * *";
cron.schedule(cornString, function () {
  console.log("this cron job is running every five minutes");
});
cornString = "45 16 * * * *";
//API Routes
app.use("/backend/api/dailyReport", require("./routes/api/dailyReport"));
app.use("/backend/api/dayStatus", require("./routes/api/dayStatus"));
app.use("/backend/api/incrementCounter", require("./routes/api/process"));
app.use("/backend/api/login", require("./routes/api/login"));
app.use("/backend/api/register", require("./routes/api/register"));
app.use("/backend/api/finalize", require("./routes/api/finalize"));

const httpsServer = https.createServer(
  {
    key: fs.readFileSync("/etc/letsencrypt/live/projectteho.com/privkey.pem"),
    cert: fs.readFileSync(
      "/etc/letsencrypt/live/projectteho.com/fullchain.pem"
    ),
  },
  app
);

const port = 8000;
httpsServer.listen(port, console.log(`Listening on port ${port}...`));
