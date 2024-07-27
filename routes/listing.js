const express = require("express");
const wrapasync = require("../utils/wrapasync.js");
const router = express.Router();
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError"); // Make sure to require ExpressError
const { isLoggedIn, isOwner, ValidateListing } = require("../middleware.js");
const listingController = require("../controller/listinngs.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });

// post and get route are combined
router
  .route("/")
  .get(wrapasync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("dat[image][url]"),
    ValidateListing,
    wrapasync(listingController.post_new)
  );
// .post(upload.single('dat[image][url]'),(req,res)=>{
//   res.send(req.file);
// });

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapasync(listingController.showroute))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("dat[image][url]"),
    wrapasync(listingController.update)
  )
  .delete(isLoggedIn, isOwner, wrapasync(listingController.delete));

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapasync(listingController.edit_form)
);

module.exports = router;
