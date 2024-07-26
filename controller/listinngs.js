const Listing = require("../models/listing");
module.exports.index = async (req, res) => {
  try {
    const allListings = await Listing.find({});
    // console.log("All Listings:", allListings); // Check what data is retrieved from MongoDB
    res.render("index.ejs", { allListings });
  } catch (err) {
    console.error("Error fetching listings:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

//show
module.exports.showroute = async (req, res) => {
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
};
//create listing
module.exports.post_new = async (req, res, next) => {
  let url=req.file.path;
  let filename=req.file.filename;
  console.log(url,"...",filename);
  const newListing = new Listing(req.body.dat);
  newListing.owner = req.user._id;
  newListing.image={url,filename};

  // it is comes from passport from login details and we pass the id of the login user

  await newListing.save();
  req.flash("success", "New listing is created");
  res.redirect("/listings");
};

//edit_from
module.exports.edit_form = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  res.render("listings/edit.ejs", { listing });
};

// update listing

module.exports.update = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);

  await Listing.findByIdAndUpdate(id, { ...req.body.dat });
  // console.log(`/listings/${id}`);
  req.flash("success", "Listing is updated");
  res.redirect(`/listings/${id}`);
};

// delete

module.exports.delete = async (req, res) => {
  const { id } = req.params;
  const deleted = await Listing.findByIdAndDelete(id);
  console.log("Deleted Listing:", deleted);
  req.flash("success", "listing Deleted");
  res.redirect("/listings");
};
