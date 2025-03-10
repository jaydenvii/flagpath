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

    if (!gridCountries || !countryOrder) {
      return res
        .status(404)
        .json({ error: "gridCountries or countryOrder not found" });
    }

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

// Updates a grid
app.put("/api/grids/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { gridCountries, countryOrder } = req.body;

    const updatedGrid = await GridModel.findOneAndUpdate(
      { id: id },
      { gridCountries, countryOrder },
      { new: true }
    );

    if (!updatedGrid) {
      return res.status(404).json({ error: "Updated grid not found" });
    }

    res.json(updatedGrid);
  } catch (err) {
    res.json(err);
  }
});

// Deletes a grid
app.delete("/api/grids/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedGrid = await GridModel.findOneAndDelete({ id: id });

    if (!deletedGrid) {
      return res.status(404).json({ error: "Deleted grid not found" });
    }

    res.json({ message: "Grid deleted" });
  } catch (err) {
    res.json(err);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}!`);
});
