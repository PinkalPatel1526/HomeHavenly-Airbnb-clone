const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema, reviewValidationSchema } = require('./schema.js');

//Validation Review
module.exports.validateReviewSchema = (req, res, next) => {
    const { error } = reviewValidationSchema.validate(req.body);
    if (error) {
        let msg = error.details.map((el) => el.message).join(', ');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

//Listing Validation
module.exports.validateListingSchema = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        let msg = error.details.map((el) => el.message).join(', ');
        throw new ExpressError(400, msg);
    } else {
        next(); 
    }
};

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }

    res.locals.currUser = req.user;
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req, res, next) => {  
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if(!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "you don't have permision");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.isAuthor = async(req, res, next) => {  
    let {id, reviewId} = req.params;

    const review = await Review.findById(reviewId);

    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "you don't have permision");
        return res.redirect(`/listing/${id}`);
    }
    next();
}


