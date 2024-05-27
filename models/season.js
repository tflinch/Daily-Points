const mongoose = require("mongoose");

const seasonSchema = new mongoose.Schema(
  {
    number: Number,
  },
  { timestamps: true }
);

const Season = mongoose.model("Season", seasonSchema);

module.exports = Season;
