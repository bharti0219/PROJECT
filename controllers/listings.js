
const Listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken:mapToken});

module.exports.index = async (req, res) => {
    const allListings = await Listing.find();
    res.render("listing/index.ejs", { allListings });
}

module.exports.new=(req, res) => {
    res.render("listing/new.ejs");
}

module.exports.show=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing You searched for does not exist!");
        res.redirect("/listings");
    }
    res.render("listing/show.ejs", { listing });
}


module.exports.create=async (req, res, next) => {

    let response =await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();

    let url=req.file.path;
    let filename=req.file.filename;
    //    if(!req.body.listing)
    //    {
    //     throw new ExpressError(400,"Send Valid data for listing");
    //    }
    // const result=listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error)
    // {
    //     throw new ExpressError(400,result.error);
    // }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    // if(!newListing.title)
    // {
    //     throw new ExpressError(400,"Title is missing");
    // }
    // if(!newListing.price)
    // {
    //     throw new ExpressError(400,"price is missing");
    // }
    // if(!newListing.description)
    // {
    //     throw new ExpressError(400,"description is missing");
    // }
    // if(!newListing.location)
    // {
    //     throw new ExpressError(400,"location is missing");
    // }
    // if(!newListing.country)
    // {
    //     throw new ExpressError(400,"country is missing");
    // }
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry;
    
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");

} 


module.exports.edit=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing You searched for does not exist!");
        res.redirect("/listings");
    }
    let originalListingUrl=listing.image.url;
    originalListingUrl=originalListingUrl.replace("/upload","/upload/w_250");
    res.render("listing/edit.ejs", { listing ,originalListingUrl});
}

module.exports.update=async (req, res) => {
    //     if(!req.body.listing)
    //    {
    //     throw new ExpressError(400,"Send Valid data for listing");
    //    }
    let { id } = req.params;
    let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file!=="undefined")
    {
        let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}


module.exports.delete=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}