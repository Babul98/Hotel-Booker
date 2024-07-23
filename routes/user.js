const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js"); //error handling middleware
const passport = require("passport");

router.get("/singup", (req, res) => {
  res.render("users/singup.ejs");
});

router.post(
  "/singup",
  wrapasync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newuser = new User({ email, username });
      const reguser = await User.register(newuser, password);
      console.log(reguser);
      req.login(reguser,(err)=>{
        if(err){
          return next(err);
        }
        req.flash("success", "user was registered");
        res.redirect("/listings");
      })
     
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/singup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true, // for flashing the message
  }),
  // local strategy using username and password
  async (req, res) => {
    // res.send("Welcome to WanderLust! You are logged in!");
    req.flash("success", "Welcome to WanderLust! You are logged in");
    res.redirect("/listings");
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
  });
});
module.exports = router;
