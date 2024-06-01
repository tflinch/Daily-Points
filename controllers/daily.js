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

router.get("/", isLoggedIn, (req, res) => {
  const { name, email, phone, _id } = req.user;
  axios
    .get("https://fakestoreapi.com/products/")
    .then((response) => {
      // console.log(response.data);
      const productsArray = response.data.map((product) => ({
        id: product.id,
        title: product.title,
        points: product.price,
        image: product.image,
        description: product.description,
      }));
      res.render("daily", { productArray: productsArray });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/leaderboard", isLoggedIn, (req, res) => {
  const { name, email, phone, _id } = req.user;
  res.render("daily/leaderboard", {});
});

router.get("/product/:id", isLoggedIn, (req, res) => {
  const { name, email, phone, _id } = req.user;
  const { id } = req.params;
  axios
    .get(`https://fakestoreapi.com/products/${id}`)
    .then((item) => {
      console.log(item);
      const product = {
        id: item.data.id,
        title: item.data.title,
        points: item.data.price,
        image: item.data.image,
        description: item.data.description,
      };

      res.render("daily/product", { product: product });
    })
    .catch((error) => console.log(error));
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
    .catch((error) => console.log(error));
});
router.get("/product/:id/edit", isLoggedIn, async (req, res) => {
  const { name, email, phone, _id } = req.user;
  const { id } = parseInt(req.params);
  try {
    // Fetch the updated product
    const updatedProduct = await Product.findOne(id).sort({
      createdAt: -1,
    });

    // Render the edit page with the updated product
    res.render("daily/edit", { product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/product/:id/delete", isLoggedIn, async (req, res) => {
  const { name, email, phone, _id } = req.user;
  const { id } = parseInt(req.params);
  try {
    // Fetch the updated product
    const updatedProduct = await Product.findOne(id).sort({
      createdAt: -1,
    });

    // Render the edit page with the updated product
    res.render("daily/delete", { product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/product", isLoggedIn, (req, res) => {
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
  Product.create(product)
    .then((response) => {
      console.log("-----Create /product \n", response);
      res.redirect("/profile");
    })
    .catch((error) => console.log(error));
});

router.put("/product/:id", isLoggedIn, async (req, res) => {
  console.log("-----Update Product--------- \n", req.body);
  const { name, email, phone, _id } = req.user;
  const { id } = req.body;
  const findId = parseInt(req.params.id);
  try {
    // Find and update the product by ID
    await Product.updateOne({ id, user_id: _id }, req.body);
    // Render the edit page with the updated product
    res.redirect("/profile");
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/product/:id", isLoggedIn, async (req, res) => {
  console.log("----Delete Product-------- \n", req.body);
  const { name, email, phone, _id } = req.user;
  const { id } = req.body;
  const findId = parseInt(req.params.id);
  try {
    // Find and update the product by ID
    await Product.deleteOne({ id, user_id: _id }, req.body);
    // Render the edit page with the updated product
    res.redirect("/profile");
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
