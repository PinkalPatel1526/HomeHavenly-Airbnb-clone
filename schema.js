const joi = require('joi');

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        image: joi.string().allow("", null),
        price: joi.number().required(),
        location: joi.string().required(),
        country: joi.string().required()
    }).required()
});

//for Review
module.exports.reviewValidationSchema = joi.object({
    review: joi.object({
        rating: joi.number().max(5).min(1).required(),
        comment: joi.string().required()
    }).required()
});






