const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); // as we don't set the path we have to search from the root
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapasync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local"); // authenticating with a username and password.
const User=require("./models/user.js");
const userRouter=require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // to access from anywhere and we don't need to define the path all the views are handled
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



const MONGO_URL = "mongodb+srv://kbhagatb:kWQa7qmLjYHtlk2q@cluster0.qhf22jm.mongodb.net/wanderlust?retryWrites=true&w=majority&appName=Cluster0";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

  const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
      expires:Date.now()+7*24*60*60*1000,
      maxAge:7*24*60*60*1000,
      httpOnly:true,

    }
  };

  app.use(session(sessionOptions));
  app.use(flash());

  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  // to authenticate the user 

  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  // for not loging again the user if once it's valid for all the pages.
  //for persistnat login

  app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
  });  
  
  // app.get("/demouser",async(req,res)=>{
  //   let fakeUser=new User({
  //     email:"student@gmail.com",
  //     username:"delta-studetnt"
  //   });

  //  let  registeuser= await User.register(fakeUser,"hellloworld");
  //     res.send(registeuser);
  // });


async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("Hi I'm root");
});

app

app.use("/listings",listings);
app.use("/listings/:id/reviews", reviews);
app.use("/",userRouter);

// :id will stay here it gives

//listings

// app.get(
//   "/listings",
//   wrapasync(async (req, res) => {
//     try {
//       const allListings = await Listing.find({});
//       // console.log(allListings[0]); // Check what data is retrieved from MongoDB
//       res.render("index.ejs", { allListings });
//     } catch (err) {
//       console.error("Error fetching listings:", err);
//       res.status(500).send("Internal Server Error");
//     }
//   })
// );

// //New Route
// app.get("/listings/new", (req, res) => {
//   res.render("listings/new.ejs");
// });
// // new is searching on the db due the :id  is treated as a member.

// // Show Routes
// app.get(
//   "/listings/:id",
//   wrapasync(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate("reviews"); //for pre populate the review from id
//     res.render("listings/show.ejs", { listing });
//   })
// );

// //Create Route

// // app.post("/listings", async (req, res,next) => {
// //   // let {title,description,image,price,country,location}=req.body;
// //   // let listing=req.body.dat; //
// //   // console.log(listing);
// //   try{
// //     const newListing = new Listing(req.body.dat);
// //   await newListing.save();
// //   res.redirect("/listings");
// //   } catch(err){
// //       next(err);
// //   }

// // });

// app.post(
//   "/listings",
//   ValidateListing,
//   wrapasync(async (req, res, next) => {
//     // if(!req.body.listing){
//     //   throw new ExpressError(400,"Send valid data for listing");
//     // }

//     // let {title,description,image,price,country,location}=req.body;
//     // let listing=req.body.dat; //
//     // console.log(listing);

//     const newListing = new Listing(req.body.dat);
//     await newListing.save();
//     res.redirect("/listings");
//   }
  
// )
// );

// // Edit Route
// app.get(
//   "/listings/:id/edit",
//   wrapasync(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", { listing });
//   })
// );

// //Update Route
// app.put(
//   "/listings/:id",
//   wrapasync(async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.dat });
//     res.redirect(`/listings/${id}`);
//   })
// );

// //Delete Route
// app.delete(
//   "/listings/:id",
//   wrapasync(async (req, res) => {
//     let { id } = req.params;
//     let deleted = await Listing.findByIdAndDelete(id);
//     console.log(deleted);
//     res.redirect("/listings");
//   })
// );
// // app.get("/testListing",async(req,res)=>{
// //     let sampleListing=new Listing({
// //         title:"My new Villa",
// //         description:"By the Beach",
// //         price:1200,
// //         location:"Telangana,Goa",
// //         country:"India",
// //     });

// //     await sampleListing.save();
// //     console.log("sample was saved");
// //     res.send("successful testing");
// // });

// //REVIEW

// app.post(
//   "/listings/:id/reviews",
//   ValidatReview,
//   wrapasync(async (req, res) => {
//     // Find the listing by ID
//     let listing = await Listing.findById(req.params.id);

//     // Check if the listing exists

//     // Create a new review from the request body
//     let newReview = new Review(req.body.review);

//     // Push the new review to the listing's reviews array
//     listing.reviews.push(newReview);

//     // Save the new review and the updated listing
//     await newReview.save();
//     await listing.save();
//     res.redirect(`/listings/${listing._id}`);

//     console.log("New review saved");

//     // Send a JSON response
//   })
// );

// // // Delete Review:

// app.delete(
//   "/listings/:id/reviews/:reviewId",
//   wrapasync(async (req, res) => {
//     let { id, reviewId } = req.params;

//     await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     //update the listing by pulling out the review
//     await Review.findByIdAndDelete(reviewId);
//     //deleting form Review
//     res.redirect(`/listings/${id}`);
//   })
// );

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  // res.send("Something went wrong!");

  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { err });
});

app.listen(8080, () => {
  console.log("Server is wrorkinat at 8080");
});
