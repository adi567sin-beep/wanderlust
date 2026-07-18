const express = require("express");
const router = express.Router();//creating express-router
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validatelisting } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//index and create router
console.log(listingController);
router//in place of app router is written(express-router)
   .route("/")
   .get(wrapAsync(listingController.index))
   .post(
      upload.single("listing[image]"),
      isLoggedIn, validatelisting,
      wrapAsync(listingController.createListing)
   );

//new route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));


router
   .route("/:id")
   .get(wrapAsync(listingController.showListing))
   .put(isLoggedIn, isOwner,
      upload.single("listing[image]"),
      validatelisting, wrapAsync(listingController.updateListing))
   .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));



module.exports = router;