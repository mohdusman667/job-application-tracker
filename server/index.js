require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const applicationsRouter = require("./routes/applications");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Job Application Tracker API is running!");
});

app.use("/api/applications", applicationsRouter);

async function startServer() {
  try {
   await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
  console.error("Could not connect to MongoDB:", error);
  if (error.reason?.servers) {
  for (const [address, server] of error.reason.servers) {
    console.error(`${address}: ${server.error?.message || "No detailed error"}`);
  }
}
  }
}

startServer();