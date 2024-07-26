const User = require("../models/user.js");

// signup form
module.exports.signup_form=(req, res) => {
    res.render("users/signup.ejs");
  }

// create user
module.exports.create_user=async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newuser = new User({ email, username });
    const reguser = await User.register(newuser, password);
    console.log(reguser);
    req.login(reguser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "user was registered");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// Render login
module.exports.renderlogin=(req, res) => {
  res.render("users/login.ejs");
};

// login 
module.exports.login=async (req, res) => {
  // res.send("Welcome to WanderLust! You are logged in!");
  req.flash("success", "Welcome to WanderLust! You are logged in");
  res.redirect("/listings");
};


// logout form
module.exports.logout=(req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
  });
};