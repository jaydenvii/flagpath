const mongoose = require("mongoose");

const GridSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  firstCountry: {
    type: String,
    required: true,
  },
  lastCountry: {
    type: String,
    required: true,
  },
  gridCountries: {
    type: [[String]],
    required: true,
  },
});

const GridModel = mongoose.model("dailygrids", GridSchema);
module.exports = GridModel;
