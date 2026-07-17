const express = require("express");
const router = express.Router({ mergeParams: true });// the id which is sent to review .it is only been in app.js .so to fetch the id of listing .use mergeparams:true
const wrapAsync = require("../utils/wrapAsync.js");
const expresserror = require("../utils/expresserror.js");
const Review = require("../models/review.js");
const listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");
const review = require("../models/review.js");


//reviews
//post routes
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview
    ));

//delte review 
router.delete("/:reviewId",
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview
    ));

module.exports = router;