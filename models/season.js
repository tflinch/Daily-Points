const mongoose = require("mongoose");

const seasonSchema = new mongoose.Schema(
  {
    season: Number,
  },
  { timestamps: true }
);

const Season = mongoose.model("Season", seasonSchema);

module.exports = Season;
