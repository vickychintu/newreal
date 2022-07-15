const express = require("express");
const connectDB = require("./config/db");
const app = express();
connectDB();
app.use(express.json({ extended: false }));
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);
const PORT = process.env.PORT || 8000;
app.get("/", (req, res) => {
  res.send("API Running");
});

//API Routes
app.use("/api/dailyReport", require("./routes/api/dailyReport"));
app.use("/api/dayStatus", require("./routes/api/dayStatus"));
app.use("/api/incrementCounter", require("./routes/api/process"));
app.use("/api/login", require("./routes/api/login"));
app.use("/api/register", require("./routes/api/register"));
app.use("/api/finalize", require("./routes/api/finalize"));

app.listen(PORT, () => {
  console.info(`App listening at http://localhost:${PORT}`);
});
