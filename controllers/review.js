const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//import Product
const { Product } = require("../models");

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

router.get("/product/:id", isLoggedIn, (req, res) => {
  const { name, email, phone, _id } = req.user;
  const { id } = req.params.id;
  res.render("review/post", {});
});
router.get("/product/:id/edit", isLoggedIn, (req, res) => {
  const { name, email, phone, _id } = req.user;
  const { id } = req.params.id;
  let idParsed = parseInt(req.params.id);
  res.render("review/edit", {});
});
router.get("/product/:id/delete", isLoggedIn, (req, res) => {
  const { name, email, phone, _id } = req.user;
  const { id } = req.params.id;
  let idParsed = parseInt(req.params.id);
  res.render("/review/delete", {});
});

router.post("/product", isLoggedIn, (req, res) => {
  console.log("--- FORM BODY \n", req.body);
  //   if (req.body.readyToEat === "on") {
  //     req.body.readyToEat = true;
  //   } else {
  //     req.body.readyToEat = false;
  //   }
  res.redirect("/profile");
});

router.put("/product/:id", isLoggedIn, (req, res) => {
  console.log("-----Update Product--------- \n", req.body);
  //   if (req.body.readyToEat === "on") {
  //     req.body.readyToEat = true;
  //   } else {
  //     req.body.readyToEat = false;
  //   }
  //   fruits[parseInt(req.params.id)] = req.body;
  res.redirect("/profile");
});

router.delete("/product/:id", isLoggedIn, (req, res) => {
  console.log("----Delete Product-------- \n", req.body);

  res.redirect("/profile");
});

module.exports = router;
