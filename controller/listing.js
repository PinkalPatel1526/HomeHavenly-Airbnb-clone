const Listing = require("../models/listing");
const mbxClient = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxClient({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const docs = await Listing.find({});
    res.render("listing/allListing.ejs", { docs });
};


module.exports.addNewListing =  (req, res) => {   
    res.render("listing/new.ejs"); 
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    
    const docs = await Listing.findById(id)
        .populate({
            path: "review",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    if (!docs) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listing");
    }

    res.render("listing/show.ejs", { docs });
};


module.exports.postListing = async (req, res) => {
    let result = await geocodingClient.forwardGeocode({
        query: `${req.body.listing.location}`,
        limit: 1,
      }).send();    
            
    const url = req.file.path;
    const filename = req.file.filename;

    const newDocs = req.body.listing;
    const docs = new Listing(newDocs);

    docs.owner = req.user._id;
    
    docs.image = {url, filename};

    docs.geometry = result.body.features[0].geometry;

    let savedListing = await docs.save();
    console.log(savedListing);
    req.flash("success", "Listing successfully posted");    
    res.redirect("/listing");
};

module.exports.editListingForm = async (req, res) => {
    const { id } = req.params;
    const docs = await Listing.findById(id);

    if(!docs) {
        req.flash("error", "Listing not exsiest"); 
        return res.redirect("/listing");
    }

    let originalImgUrl = docs.image.url.replace("/upload/", "/upload/h_300,w_350/");

    res.render("listing/edit.ejs", { docs, originalImgUrl });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const editedDocs = req.body.listing;

    const listing = await Listing.findByIdAndUpdate(id, editedDocs);

    if(typeof req.file !== "undefined") {
        const url = req.file.path;
        const filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing successfully Updated"); 
    res.redirect(`/listing/${id}`);
}; 

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing successfully Deleted"); 
    res.redirect("/listing");
};

