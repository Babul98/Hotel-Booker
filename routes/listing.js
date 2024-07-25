const express = require("express");
const wrapasync = require("../utils/wrapasync.js");
const router = express.Router();
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError"); // Make sure to require ExpressError
const { isLoggedIn, isOwner } = require("../middleware.js");

const ValidateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

router.get(
  "/",
  wrapasync(async (req, res) => {
    try {
      const allListings = await Listing.find({});
      // console.log("All Listings:", allListings); // Check what data is retrieved from MongoDB
      res.render("index.ejs", { allListings });
    } catch (err) {
      console.error("Error fetching listings:", err);
      res.status(500).send("Internal Server Error");
    }
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

//show Route
router.get(
  "/:id",
  wrapasync(async (req, res) => {
    const { id } = req.params;
    //we are populating the reviews and owner
    // nesting populate for review author
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    //if owner is not exists then we populate with the current user
    if (!listing) {
      req.flash("error", " listing does'nt exists");
      res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
  })
);

router.post(
  "/",
  ValidateListing,
  wrapasync(async (req, res, next) => {
    const newListing = new Listing(req.body.dat);
    newListing.owner = req.user._id;
    // it is comes from passport from login details and we pass the id of the login user

    await newListing.save();
    req.flash("success", "New listing is created");
    res.redirect("/listings");
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapasync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

//update route:

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapasync(async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);

    await Listing.findByIdAndUpdate(id, { ...req.body.dat });
    // console.log(`/listings/${id}`);
    req.flash("success", "Listing is updated");
    res.redirect(`/listings/${id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapasync(async (req, res) => {
    const { id } = req.params;
    const deleted = await Listing.findByIdAndDelete(id);
    console.log("Deleted Listing:", deleted);
    req.flash("success", "listing Deleted");
    res.redirect("/listings");
  })
);

module.exports = router;
