const express = require("express");
const router = express.Router();
const AsyncWrap = require("../utils/AsyncWrap.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });


const listingController=require("../controllers/listings.js")

router.route("/")
.get(AsyncWrap(listingController.index))//index route
.post(isLoggedIn,upload.single('listing[image]'),validateListing, AsyncWrap(listingController.create)); //create route


//new route
router.get("/new", isLoggedIn,listingController.new);

router.route("/:id")
.get(AsyncWrap(listingController.show))//show route
.put(isLoggedIn, isOwner, upload.single('listing[image]'),validateListing, AsyncWrap(listingController.update))//update route
.delete(isLoggedIn, isOwner, AsyncWrap(listingController.delete));


//edit route
router.get("/:id/edit", isLoggedIn, isOwner, AsyncWrap(listingController.edit));
module.exports = router;