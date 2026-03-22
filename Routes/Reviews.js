const express = require("express");
const router = express.Router({mergeParams: true});

// e. access the module (wrapAsync)
const wrapAsync = require("../Utils/wrapAsync.js");
const ExpressError = require("../Utils/ExpressError.js");

// e. access the module for listing(place) (model)
const ListingModel = require("../models/listing.js");

// f.access the module for Review (model)
const Review = require("../models/review.js");

// require  validateReview middleware
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");


//  To require ReviewController
const reviewController = require("../Controllers/ReviewController.js");





 
// 6.1 Review Route reviewPlace=listing , To Add the new Review
router.post("/",isLoggedIn,validateReview,wrapAsync (reviewController.createReview));

// 6.2 Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;