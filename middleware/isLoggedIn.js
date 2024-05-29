function isLoggedIn(req, res, next) {
  if (!req.user) {
    req.flash("error", "You must be signed in to view page");
    res.redirect("/auth/login");
  } else {
    next();
  }
}

module.exports = isLoggedIn;
