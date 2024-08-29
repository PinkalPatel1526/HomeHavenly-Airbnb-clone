const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const { reviewValidationSchema } = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');
const { isLoggedIn, isOwner, isAuthor, validateReviewSchema } = require('../middleware.js');
const reviewControll = require("../controller/review.js");

// Post Review
router.post("/", isLoggedIn ,validateReviewSchema, wrapAsync(reviewControll.postReview));

//Delete a Reviews
router.delete("/:reviewId",isLoggedIn, isAuthor ,reviewControll.deleteReview)


module.exports = router;
