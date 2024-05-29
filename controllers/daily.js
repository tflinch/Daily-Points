const express = require("express");
const router = express.Router();

// const isLoggedIn = require("./middleware/isLoggedIn");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/", isLoggedIn, (req, res) => {
  const { name, email, phone, _id } = req.user;
  res.render("daily", { name, email, phone, _id });
});

module.exports = router;
