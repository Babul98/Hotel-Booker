require("dotenv").config();
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
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local"); // authenticating with a username and password.
const User=require("./models/user.js");
const userRouter=require("./routes/user.js");
const { optional } = require("joi");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // to access from anywhere and we don't need to define the path all the views are handled
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const MONGO_URL = process.env.MONGO_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => { 
    console.log(err);
  });

  const store=MongoStore.create({
    mongoUrl:MONGO_URL,
    crypto:{
      secret:process.env.SECRET,
    },
    touchAfter:24*3600,
  
  });
  
  store.on("error",()=>{
    console.log("Error in Mongo Session Store",err); 
  })
  
  const sessionOptions={
    store,
    secret:process.env.SECRET,
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
  res.redirect("/listings");
});



app.use("/listings",listings);
app.use("/listings/:id/reviews", reviews);
app.use("/",userRouter);



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
