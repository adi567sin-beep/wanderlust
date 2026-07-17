if (process.env.NODE_ENV != "production") {
  require('dotenv').config();
}

const express = require("express");  /*Node.js looks inside node_modules Loads the Express and Mongoose packages into memoryThese packages export functions/objects*/
const app = express();/*Calls the Express function
Returns an app object*/

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");//help to create template
const expresserror = require("./utils/expresserror.js");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dburl = process.env.ATLASDB_URL;
//basics
main()  // return promise 
  .then(() => {// runs on success
    console.log("connected to db");
  })
  .catch((err) => {// runs on failure
    console.log(err);
  });

async function main() {// asyn-Makes function return a Promise automatically
  await mongoose.connect(dburl); // connecting db with this project
}
// ----- basics -----
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//app.use(express.urlencoded({extended:true}));
const qs = require("qs");
const { error } = require("console");
app.use(express.urlencoded({
  extended: true,
  parameterLimit: 1000
}));

app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});


store.on("error", () => {
  console.log("error in mongo session store", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,// all the login data r stored in cookies, cookies donot have expire date so, we wll set it
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());// middleware that init passport
app.use(passport.session());//mweb application needs the ability to identity users as they browse from page to page .this series of requests and response , each associated with user the same user=> session
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());//When a user logs in successfully, Passport needs to decide what data should be stored in the session.
passport.deserializeUser(User.deserializeUser());//For every request after login, Passport takes the stored id from the session and fetches the complete user from the database

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//the common middlware is written here .in router we have removed the common middleware
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

//$pull(delete) operator removes from existing array all instances of a value that match a specified condition
app.use((req, res, next) => {
  next(new expresserror(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {//Starting the Server
  console.log("working");
});