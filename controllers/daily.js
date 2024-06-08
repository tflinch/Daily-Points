require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");
const mongoose = require("mongoose");
const SEASON = process.env.SEASON_NUMBER;

// const isLoggedIn = require("./middleware/isLoggedIn");
const isLoggedIn = require("../middleware/isLoggedIn");

//Data Import
const { Product } = require("../models");
const { Review } = require("../models");
//Import Shuffle function
const { shuffleArray } = require("../utils");

router.get("/", isLoggedIn, (req, res) => {
  axios
    .get("https://fakestoreapi.com/products/")
    .then(async (response) => {
      const productsFromAPI = response.data.map((product) => ({
        id: product.id,
        title: product.title,
        points: product.price,
        image: product.image,
        description: product.description,
      }));

      // Fetch all product IDs from the database
      const existingProductIds = (
        await Product.find({}, { _id: 0, id: 1 })
      ).map((product) => product.id);

      // Filter out products from API that are not in the database
      const newProducts = productsFromAPI.filter(
        (product) => !existingProductIds.includes(product.id)
      );

      // Shuffle the new products
      const shuffledProducts = shuffleArray(newProducts);

      // Select the first four products
      const selectedProducts = shuffledProducts.slice(0, 4);

      // Render the view with the selected products
      res.render("daily", { productArray: selectedProducts });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/leaderboard", isLoggedIn, async (req, res) => {
  try {
    const topUsers = await Review.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$customer_id",
          totalPoints: { $sum: "$product.points" },
          mostRecentReview: { $max: "$createdAt" },
          mostRecentProduct: { $first: "$product" },
        },
      },
      { $sort: { totalPoints: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          name: "$user.name",
          totalPoints: 1,
          mostRecentProduct: {
            id: "$mostRecentProduct.id",
            title: "$mostRecentProduct.title",
          },
        },
      },
    ]);

    res.render("daily/leaderboard", { topUsers });
  } catch (error) {
    console.error(error);
    req.flash("error", "Internal Server Error");
    res.status(500).redirect("/profile");
  }
});

router.get("/product/:id", isLoggedIn, (req, res) => {
  const { name, email, phone, _id } = req.user;
  const { id } = req.params;
  axios
    .get(`https://fakestoreapi.com/products/${id}`)
    .then((item) => {
      const product = {
        id: item.data.id,
        title: item.data.title,
        points: item.data.price,
        image: item.data.image,
        description: item.data.description,
      };

      res.render("daily/product", { product: product });
    })
    .catch((error) => {
      if (error.response && error.response.status === 404) {
        // If the product is not found (404), render a no-results page
        return res.render("daily/no-results", {});
      } else {
        // If there's any other error, render an error page
        console.error("Error fetching product:", error);
        req.flash("error", "An error occurred while fetching the product");
        res.status(500).redirect("/profile");
      }
    });
});
router.get("/product/:id/create", isLoggedIn, (req, res) => {
  const { name, email, phone, _id } = req.user;
  const { id } = req.params;
  axios
    .get(`https://fakestoreapi.com/products/${id}`)
    .then((item) => {
      const product = {
        id: item.data.id,
        title: item.data.title,
        points: item.data.price,
        image: item.data.image,
        description: item.data.description,
      };

      res.render("daily/create", { product: product });
    })
    .catch((error) => {
      req.flash("error", "fetching product");
      res.status(500).redirect("/profile");
    });
});
router.get("/product/:id/edit", isLoggedIn, async (req, res) => {
  const { name, email, phone, _id } = req.user;
  const { id } = parseInt(req.params);
  try {
    const updatedProduct = await Product.findOne(id).sort({
      createdAt: -1,
    });
    res.render("daily/edit", { product: updatedProduct });
  } catch (error) {
    req.flash("error", "Error Fetching product");
    res.status(500).redirect("/profile");
  }
});
router.get("/product/:id/delete", isLoggedIn, async (req, res) => {
  const { name, email, phone, _id } = req.user;
  const { id } = parseInt(req.params);
  try {
    const updatedProduct = await Product.findOne(id).sort({
      createdAt: -1,
    });
    res.render("daily/delete", { product: updatedProduct });
  } catch (error) {
    req.flash("error", "Error Fetching Product");
    res.status(500).redirect("/profile");
  }
});

router.post("/product", isLoggedIn, async (req, res) => {
  console.log("--- FORM BODY \n", req.body);
  const { id, title, points, image, description } = req.body;
  const product = {
    id,
    title,
    points,
    image,
    description,
    season_id: SEASON,
    user_id: req.user._id,
  };
  await Product.create(product)
    .then((response) => {
      console.log("-----Create /product \n", response);
      res.redirect("/profile");
    })
    .catch((error) => {
      req.flash("error", "Error Creating Product");
      res.status(500).redirect("/profile");
    });
});

router.put("/product/:id", isLoggedIn, async (req, res) => {
  console.log("-----Update Product--------- \n", req.body);
  const { name, email, phone, _id } = req.user;
  const { id } = req.body;
  const findId = parseInt(req.params.id);
  try {
    await Product.updateOne({ id, user_id: _id }, req.body);
    res.redirect("/profile");
  } catch (error) {
    req.flash("error", "Error Updating Product");
    res.status(500).redirect("/profile");
  }
});

router.delete("/product/:id", isLoggedIn, async (req, res) => {
  console.log("----Delete Product-------- \n", req.body);
  const { name, email, phone, _id } = req.user;
  const { id } = req.body;
  const findId = parseInt(req.params.id);
  try {
    await Product.deleteOne({ id, user_id: _id }, req.body);
    res.redirect("/profile");
  } catch (error) {
    req.flash("error", "Error Deleting Product");
    res.status(500).redirect("/profile");
  }
});

module.exports = router;
