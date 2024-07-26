const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js"); //error handling middleware
const passport = require("passport");
const userController=require("../controller/users.js");

//signup form
router.get("/signup", userController.signup_form);

// create user
router.post(
  "/signup",
  wrapasync(userController.create_user)
);

//login
router.get("/login",userController.renderlogin );

router.post( 
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true, // for flashing the message
  }),
  // local strategy using username and password
  userController.login
);

router.get("/logout", userController.logout);
module.exports = router;
