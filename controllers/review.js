const express = require("express");
const router = express.Router();

// const isLoggedIn = require("./middleware/isLoggedIn");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/", isLoggedIn, (req, res) => {
  const { name, email, phone, _id } = req.user;
  res.render("review", { name, email, phone, _id });
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
