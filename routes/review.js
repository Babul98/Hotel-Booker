const express = require("express");
const wrapasync = require("../utils/wrapasync.js");
const router = express.Router({mergeParams:true}); // to handling the parameter
const ExpressError = require("../utils/ExpressError.js");
const {  reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


// Reviews


const ValidatReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };

  router.post(
  "/",
  ValidatReview,
  wrapasync(async (req, res) => {
    // Find the listing by ID
    let listing = await Listing.findById(req.params.id);

    // Check if the listing exists

    // Create a new review from the request body
    let newReview = new Review(req.body.review);

    // Push the new review to the listing's reviews array
    listing.reviews.push(newReview);

    // Save the new review and the updated listing
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created");
    res.redirect(`/listings/${listing._id}`);

    console.log("New review saved");

    // Send a JSON response
  })
);
  // Delete Review:
  
router.delete(
    "/:reviewId",
    wrapasync(async (req, res) => {
      let { id, reviewId } = req.params;
  
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      //update the listing by pulling out the review
      await Review.findByIdAndDelete(reviewId);
      //deleting form Review
      res.redirect(`/listings/${id}`);
    })
  );

  module.exports=router;