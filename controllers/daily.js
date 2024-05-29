const express = require("express");
const router = express.Router();

// const isLoggedIn = require("./middleware/isLoggedIn");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/", isLoggedIn, (req, res) => {
  const { name, email, phone, _id } = req.user;
  res.render("daily", { name, email, phone, _id });
});
router.get("/product/:id", isLoggedIn, (req, res) => {
  const { name, email, phone, _id } = req.user;
  const { id } = req.params.id;
  res.render("daily/product", {});
});

module.exports = router;
