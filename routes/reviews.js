const express=require("express");
const router=express.Router({ mergeParams: true });
const AsyncWrap=require("../utils/AsyncWrap.js");
const Review =require("../models/review.js");
const Listing =require("../models/listing.js");
const  {isLoggedIn,validateReview,isAuthor}=require("../middleware.js");
const reviewControllers=require("../controllers/reviews.js");



//post review route
router.post("/",isLoggedIn,validateReview,AsyncWrap (reviewControllers.post));

//delete review route
router.delete("/:reviewId",isLoggedIn,isAuthor,AsyncWrap(reviewControllers.delete));

module.exports=router;