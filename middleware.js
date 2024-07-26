const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");


module.exports.isLoggedIn=(req,res,next)=>{
    // console.log(req.user);
  if(!req.isAuthenticated()){
    req.flash("error","You must be logged in to create listings!");
  return  res.redirect("/login");
  }
  next();

}

//authorization
 module.exports.isOwner=async(req,res,next)=>{
  let{id}=req.params;
  let listing= await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You're not owner of this listing")
    return  res.redirect(`/listings/${id}`);
} 
next();
 }


 //Authorization of Reviewer
 module.exports.isReviewer=async(req,res,next)=>{
  let{id,reviewId}=req.params;
  let review= await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You'did not create  this Review")
    return  res.redirect(`/listings/${id}`);
} 
next();
 }

// for Review
 module.exports.ValidateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//Validate Listing
module.exports.ValidateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};