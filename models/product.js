const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: Number,
    title: String,
    points: Number,
    image: String,
    description: String,
    season_id: { type: mongoose.Schema.Types.ObjectId, ref: "Season" },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
