const Listing = require("../models/listing");
const Review = require("../models/review.js");

module.exports.review_post=async (req, res) => {
    // Find the listing by ID
    let listing = await Listing.findById(req.params.id);

    // Check if the listing exists

    // Create a new review from the request body
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    // autoher  is loggedin user
    console.log(newReview); 


    // Push the new review to the listing's reviews array
    listing.reviews.push(newReview);

    // Save the new review and the updated listing
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created");
    res.redirect(`/listings/${listing._id}`);

    console.log("New review saved");

    // Send a JSON response
  }

  //Delete Review
  module.exports.delete_review=async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    //update the listing by pulling out the review
    await Review.findByIdAndDelete(reviewId);
    //deleting form Review
    res.redirect(`/listings/${id}`);
  }