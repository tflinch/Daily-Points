const express = require("express");
const router = express.Router();
const axios = require("axios");

// const isLoggedIn = require("./middleware/isLoggedIn");
const isLoggedIn = require("../middleware/isLoggedIn");

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
        img: product.image,
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
        img: item.data.image,
        description: item.data.description,
      };

      res.render("daily/product", { product: product });
    })
    .catch((error) => console.log(error));
});
router.get("/product/:id/edit", isLoggedIn, (req, res) => {
  const { name, email, phone, _id } = req.user;
  const { id } = req.params.id;
  let idParsed = parseInt(req.params.id);
  res.render("daily/edit", {});
});
router.get("/product/:id/delete", isLoggedIn, (req, res) => {
  const { name, email, phone, _id } = req.user;
  const { id } = req.params.id;
  let idParsed = parseInt(req.params.id);
  res.render("daily/delete", {});
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
