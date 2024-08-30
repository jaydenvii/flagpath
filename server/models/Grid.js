const mongoose = require("mongoose");

const GridSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
  },
  gridCountries: {
    type: [[String]],
    required: true,
  },
  countryOrder: {
    type: [String],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const GridModel = mongoose.model("dailygrids", GridSchema);
module.exports = GridModel;
