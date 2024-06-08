const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//import Product
const { Product } = require("../models");
const { Review } = require("../models");

const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/", isLoggedIn, async (req, res) => {
  const { name, email, phone, _id } = req.user;
  try {
    // Aggregate query to find the latest 4 products without reviews
    // Lookup reviews for each product
    // Match products that have no reviews
    const latestProductsWithoutReviews = await Product.aggregate([
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "product_id",
          as: "reviews",
        },
      },

      {
        $match: { reviews: { $eq: [] } },
      },

      {
        $sort: { createdAt: -1 },
      },

      {
        $limit: 4,
      },
    ]);
    res.render("review", {
      products: latestProductsWithoutReviews,
    });
  } catch (error) {
    req.flash("error", "Error fetching latest products without reviews");
    res.status(500).redirect("/profile");
  }
});

router.get("/product/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  try {
    const foundProduct = await Product.findOne({ id: parseInt(id) });
    res.render("review/post", {
      product: foundProduct,
    });
  } catch (error) {
    req.flash("error", "Error product to review review");
    res.status(500).redirect("/profile");
  }
});
router.get("/product/:id/create", isLoggedIn, async (req, res) => {
  const { name, email, phone, _id } = req.user;
  const { id } = req.params;
  try {
    const foundProduct = await Product.findOne({ id: parseInt(id) });
    res.render("review/create", { product: foundProduct, customer_id: _id });
  } catch (error) {
    req.flash("error", "Error product to review review");
    res.status(500).redirect("/profile");
  }
});
router.get("/product/:id/edit", isLoggedIn, async (req, res) => {
  const { name, email, phone, _id } = req.user;
  const { id } = req.params;

  try {
    const updatedProduct = await Product.findOne({ id: parseInt(id) });

    if (!updatedProduct) {
      req.flash("error", "Error product not found");
      return res.status(404).redirect("/profile");
    }
    const updatedReview = await Review.findOne({
      product_id: updatedProduct._id,
      customer_id: _id,
    });

    res.render("review/edit", {
      product: updatedProduct,
      review: updatedReview,
      customer_id: _id,
    });
  } catch (error) {
    req.flash("error", "Error fetching product for edit");
    res.status(500).redirect("/profile");
  }
});
router.get("/product/:id/delete", isLoggedIn, async (req, res) => {
  const { name, email, phone, _id } = req.user;
  const { id } = req.params;

  try {
    const updatedProduct = await Product.findOne({ id: parseInt(id) });

    if (!updatedProduct) {
      req.flash("error", "Error product not found");
      return res.status(404).redirect("/profile");
    }

    const updatedReview = await Review.findOne({
      product_id: updatedProduct._id,
      customer_id: _id,
    });
    res.render("review/delete", {
      product: updatedProduct,
      review: updatedReview,
      customer_id: _id,
    });
  } catch (error) {
    req.flash("error", "Error fetching product for edit");
    res.status(500).redirect("/profile");
  }
});

router.post("/product", isLoggedIn, async (req, res) => {
  console.log("--- FORM BODY \n", req.body);
  try {
    const newReview = new Review(req.body);
    await newReview.save();
    res.redirect("/profile");
  } catch (error) {
    req.flash("error", "Error creating product");
    res.status(500).redirect("/profile");
  }
});

router.put("/product/:id", isLoggedIn, async (req, res) => {
  console.log("-----Update Review--------- \n", req.body);
  const { id } = req.params;
  const { name, email, phone, _id } = req.user;

  try {
    const result = await Review.updateOne(
      { product_id: req.body.product_id, customer_id: _id },
      req.body
    );

    if (result.nModified === 0) {
      console.log("No reviews were updated.");
    }
    res.redirect("/profile");
  } catch (error) {
    req.flash("error", "Internal Server Error");
    res.status(500).redirect("/profile");
  }
});

router.delete("/product/:id", isLoggedIn, async (req, res) => {
  console.log("----Delete Review-------- \n", req.body);
  const { _id } = req.user;
  try {
    // Find and update the product by ID
    const result = await Review.deleteOne({
      _id: req.body.id,
      customer_id: _id,
    });

    if (result.deletedCount === 0) {
      req.flash("error", "Error deleting review, No review found");
      return res.status(404).redirect("/profile");
    }
    res.redirect("/profile");
  } catch (error) {
    req.flash("error", "Error updating product");
    res.status(500).redirect("/profile");
  }
});

module.exports = router;
