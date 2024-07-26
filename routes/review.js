const express = require("express");
const wrapasync = require("../utils/wrapasync.js");
const router = express.Router({ mergeParams: true }); // to handling the parameter
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { ValidateReview, isLoggedIn, isReviewer } = require("../middleware.js");
const review_controller = require("../controller/reviews.js");

// Reviews

// post a review
router.post(
  "/",
  ValidateReview,
  isLoggedIn,
  wrapasync(review_controller.review_post)
);
// Delete Review:

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewer,
  wrapasync(review_controller.delete_review)
);

module.exports = router;
