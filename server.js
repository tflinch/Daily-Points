require("dotenv").config();
const express = require("express");
const app = express();
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("./config/passport-config");
const isLoggedIn = require("./middleware/isLoggedIn");
const SECRET_SESSION = process.env.SECRET_SESSION;
const PORT = process.env.PORT || 3001;

// import model
const { User } = require("./models");
const { Product } = require("./models");
const { Review } = require("./models");

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use("/", express.static("public"));
app.use(
  session({
    secret: SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

// initial passport
app.use(passport.initialize());
app.use(passport.session());

// middleware for tracking users and alerts
app.use((req, res, next) => {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next(); // going to said route
});

app.get("/", (req, res) => {
  res.render("home", {});
});

// import auth routes
app.use("/auth", require("./controllers/auth"));
app.use("/daily", require("./controllers/daily"));
app.use("/review", require("./controllers/review"));
// app.use('/pokemon', require('./controllers/pokemon'));
// app.use('/', require('./controllers/pokemon'));

// --- AUTHENTICATED ROUTE: go to user profile page ---
app.get("/profile", isLoggedIn, async (req, res) => {
  const { name, email, phone, _id } = req.user;
  try {
    const foundProduct = await Product.findOne({ user_id: _id }).sort({
      createdAt: -1,
    });
    const totalProducts = await Product.countDocuments({ user_id: _id });
    const totalReviews = await Review.countDocuments({ customer_id: _id });

    // Find the most recent review for the user
    const recentReview = await Review.findOne({ customer_id: _id }).sort({
      createdAt: -1,
    });
    let recentProduct = {};

    if (recentReview) {
      // Find the product associated with the most recent review
      const recentReviewedProduct = await Product.findOne({
        _id: recentReview.product_id,
      });
      if (recentReviewedProduct) {
        recentProduct = {
          title: recentReviewedProduct.title,
          id: recentReviewedProduct.id,
        };
      }
    }

    res.render("profile", {
      name,
      email,
      phone,
      product: foundProduct,
      totalProducts,
      recentProduct,
      totalReviews,
    });
  } catch (error) {
    console.log(error);
  }
});

// any authenticated route will need to have isLoggedIn before controller
// app.get('/pokemon', isLoggedIn, (req, res) => {
//     // get data
//     // render page + send data to page
// });

// app.get('/pokemon/:id/edit', isLoggedIn, (req, res) => {});

// app.delete('/pokemon/:id', isLoggedIn, (req, res) => {});

const server = app.listen(PORT, () => {
  console.log("🏎️ You are listening on PORT", PORT);
});

module.exports = server;
