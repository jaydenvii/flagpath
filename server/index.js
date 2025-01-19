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

// Adds a new grid to the database
app.post("/api/grids", async (req, res) => {
  try {
    const { gridCountries, countryOrder } = req.body;
    const gridCount = await GridModel.countDocuments();

    // Tomorrow's date
    const today = new Date();
    const tomorrow = today.setDate(today.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const day = String(tomorrow.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}T05:00:00.000+00:00`;

    const newGrid = {
      id: gridCount + 1,
      gridCountries: gridCountries,
      countryOrder: countryOrder,
      date: formattedDate,
    };

    await newGrid.save();

    res.json(newGrid);
  } catch (err) {
    res.json(err);
  }
});

// Fetches all grids from the database
app.get("/api/grids", async (req, res) => {
  try {
    // Only sends grids from today and before
    const today = new Date();

    const result = await GridModel.find({ date: { $lte: today } });
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}!`);
});
