const Review = require("../models/review.js");
const Listing = require("../models/listing.js")


module.exports.postReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.review.push(newReview);

    await listing.save();
    await newReview.save();
    req.flash("success", "Review successfully posted"); 
    res.redirect(`/listing/${listing._id}`);
};

module.exports.deleteReview = async(req, res) => {
    let {id, reviewId} = req.params;
    
    await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId}});
    await Review.findByIdAndDelete(req.params.reviewId);

    req.flash("success", "Review successfully Deleted"); 


    res.redirect(`/listing/${id}`);
};