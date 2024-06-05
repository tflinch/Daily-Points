require("dotenv").config();
const express = require("express");
const app = express();
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("./config/passport-config");
const isLoggedIn = require("./middleware/isLoggedIn");
const SECRET_SESSION = process.env.SECRET_SESSION;
const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT || 3001;
const ElasticEmail = require("@elasticemail/elasticemail-client");

const client = ElasticEmail.ApiClient.instance;

const apikey = client.authentications["apikey"];
apikey.apiKey = process.env.API_KEY;

// import model
const { User } = require("./models");
const { Product } = require("./models");
const { Review } = require("./models");
const { default: axios } = require("axios");

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

    // Fetch all reviews created by the user
    const userReviews = await Review.find({ customer_id: _id });

    // Extract product IDs from the user's reviews
    const productIds = userReviews.map((review) => review.product_id);

    // Fetch products that the user has reviewed
    const reviewedProducts = await Product.find({ _id: { $in: productIds } });

    // Calculate the total points from reviewed products
    const totalPoints = reviewedProducts.reduce(
      (sum, product) => sum + product.points,
      0
    );

    // Aggregate points by user, sort by total points, and limit to top 3 users
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
        },
      },
      { $sort: { totalPoints: -1 } },
      { $limit: 3 },
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
        },
      },
    ]);
    console.log("TotalPoints:", totalPoints);
    console.log("topUsers:", topUsers);

    res.render("profile", {
      name,
      email,
      phone,
      product: foundProduct,
      totalProducts,
      recentProduct,
      totalReviews,
      topUsers,
      totalPoints,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.post("/contact", (req, res) => {
  console.log(req.body);
  const { fullName, email, phone, subject, message } = req.body;

  // Validate form data
  if (!fullName || !email || !subject || !message) {
    return res.status(400).send("Incomplete form data");
  }

  // Check if required environment variables are present
  if (!process.env.EMAIL_FROM || !apikey) {
    return res.status(500).send("Missing environment variables");
  }

  const emailsApi = new ElasticEmail.EmailsApi();

  const emailData = {
    Recipients: [
      {
        Email: process.env.EMAIL_FROM,
        Fields: {
          name: fullName,
        },
      },
    ],
    Content: {
      Body: [
        {
          ContentType: "HTML",
          Charset: "utf-8",
          Content: `<p>Name: ${fullName}</p><p>Email: ${email}</p><p>Phone: ${phone}</p><p>Message: ${message}</p>`,
        },
      ],
      From: process.env.EMAIL_FROM,
      Subject: subject,
    },
  };

  const callback = (error, data, response) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Error sending email");
    } else {
      console.log("API called successfully.");
      console.log("Email sent.");
      return res.status(200).redirect("/contact");
    }
  };

  emailsApi.emailsPost(emailData, callback);
  console.log("sucess");
});

// app.get('/pokemon/:id/edit', isLoggedIn, (req, res) => {});

// app.delete('/pokemon/:id', isLoggedIn, (req, res) => {});

const server = app.listen(PORT, () => {
  console.log("🏎️ You are listening on PORT", PORT);
});

module.exports = server;
