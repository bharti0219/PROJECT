const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const AsyncWrap = require("../utils/AsyncWrap.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userControllers=require("../controllers/users.js");

router.route("/signup")
.get(userControllers.renderSignup)
.post(AsyncWrap(userControllers.Signup));

router.route("/login")
.get(userControllers.renderLogin)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),AsyncWrap(userControllers.Login));


router.get("/logout",userControllers.logout);



module.exports=router;