const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//import Product
const { Product } = require("../models");
const { Review } = require("../models");

// const isLoggedIn = require("./middleware/isLoggedIn");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/", isLoggedIn, async (req, res) => {
  const { name, email, phone, _id } = req.user;
  try {
    // Aggregate query to find the latest 4 products without reviews
    const latestProductsWithoutReviews = await Product.aggregate([
      // Lookup reviews for each product
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "product_id",
          as: "reviews",
        },
      },
      // Match products that have no reviews
      {
        $match: { reviews: { $eq: [] } },
      },
      // Sort by creation date in descending order
      {
        $sort: { createdAt: -1 },
      },
      // Limit to 4 products
      {
        $limit: 4,
      },
    ]);

    // Log the fetched products to ensure they are correctly retrieved
    console.log(
      "Latest Products Without Reviews:",
      latestProductsWithoutReviews
    );

    // Render the review template with user details and the latest products
    res.render("review", {
      products: latestProductsWithoutReviews,
    });
  } catch (error) {
    console.error("Error fetching latest products without reviews:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/product/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const foundProduct = await Product.findOne({ id: parseInt(id) });
    res.render("review/post", {
      product: foundProduct,
    });
  } catch (error) {
    console.error("Error product to review review:", error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/product/:id/create", isLoggedIn, async (req, res) => {
  const { name, email, phone, _id } = req.user;
  const { id } = req.params;
  try {
    const foundProduct = await Product.findOne({ id: parseInt(id) });
    res.render("review/create", { product: foundProduct, customer_id: _id });
  } catch (error) {
    console.error("Error product to review review:", error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/product/:id/edit", isLoggedIn, async (req, res) => {
  const { name, email, phone, _id } = req.user;
  const { id } = req.params;

  try {
    // Fetch the product by its numeric ID
    const updatedProduct = await Product.findOne({ id: parseInt(id) });

    if (!updatedProduct) {
      return res.status(404).send("Product not found");
    }

    // Find the review by product ID and customer ID
    const updatedReview = await Review.findOne({
      product_id: updatedProduct._id,
      customer_id: _id,
    });

    // Render the edit page with the updated product and review
    res.render("review/edit", {
      product: updatedProduct,
      review: updatedReview,
      customer_id: _id,
    });
  } catch (error) {
    console.error("Error fetching product for edit:", error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/product/:id/delete", isLoggedIn, (req, res) => {
  const { name, email, phone, _id } = req.user;
  const { id } = req.params.id;
  let idParsed = parseInt(req.params.id);
  res.render("review/delete", {});
});

router.post("/product", isLoggedIn, async (req, res) => {
  console.log("--- FORM BODY \n", req.body);
  try {
    const newReview = new Review(req.body);
    await newReview.save();
    res.redirect("/profile");
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/product/:id", isLoggedIn, async (req, res) => {
  console.log("-----Update Review--------- \n", req.body);
  const { id } = req.params; // Extract ID from URL
  const { name, email, phone, _id } = req.user;

  try {
    // Find and update the review by product_id and customer_id
    const result = await Review.updateOne(
      { product_id: req.body.product_id, customer_id: _id },
      req.body
    );

    if (result.nModified === 0) {
      // Handle case where no documents were modified
      console.log("No reviews were updated.");
    }

    // Redirect to profile after updating
    res.redirect("/profile");
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/product/:id", isLoggedIn, (req, res) => {
  console.log("----Delete Product-------- \n", req.body);

  res.redirect("/profile");
});

module.exports = router;
