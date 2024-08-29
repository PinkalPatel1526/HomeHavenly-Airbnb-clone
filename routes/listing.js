const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');

const ExpressError = require('../utils/ExpressError.js');
const { isLoggedIn, isOwner, validateListingSchema } = require('../middleware.js');
const listingControll = require('../controller/listing.js');

const multer  = require('multer');

const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

//all listing
router.get("/", wrapAsync(listingControll.index));

//new listing form
router.get("/new", isLoggedIn ,listingControll.addNewListing);

//show Listing
router.get("/:id", wrapAsync(listingControll.showListing));

//Post listing 
router.post("/",isLoggedIn, upload.single("listing[image]"), validateListingSchema ,wrapAsync(listingControll.postListing));

//Get edit-form listing 
router.get("/:id/edit",isLoggedIn , isOwner ,wrapAsync(listingControll.editListingForm));

//Update into DB
router.put("/:id",isOwner, upload.single("listing[image]"), validateListingSchema, wrapAsync(listingControll.updateListing));

//Delete Listing
router.delete("/:id",isLoggedIn, isOwner ,wrapAsync(listingControll.deleteListing));


module.exports = router;
