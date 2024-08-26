require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const GridModel = require("./models/Grid");
const cors = require("cors");

const app = express();

const frontendURL = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: frontendURL,
  })
);

app.use(express.json());

const dbURL = process.env.MONGODB_URL;

mongoose
  .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Fetches all grids from the database
app.get("/getGrids", async (req, res) => {
  try {
    const result = await GridModel.find({});
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}!`);
});
