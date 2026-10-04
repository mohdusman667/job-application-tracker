require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const applicationsRouter = require("./routes/applications");
const aiRoutes = require("./routes/ai");

const app = express();
const PORT = 5000;

app.use(cors({ origin: "https://job-application-tracker-ten-ecru.vercel.app" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Job Application Tracker API is running!");
});

app.use("/api/applications", applicationsRouter);
app.use("/api/ai", aiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URI, { family: 4 })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Could not connect to MongoDB:", error.message);
  });