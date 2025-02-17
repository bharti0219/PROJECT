const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const User=require("../models/user.js");


module.exports.renderSignup=(req,res)=>
{
    res.render("users/signup.ejs");
}

module.exports.Signup=async(req,res)=>
{
  try{

    let {username,email,password}=req.body;
  const newUser=new User({username,email});
  const registeredUser=await User.register(newUser,password);
  
  req.login(registeredUser,(err)=>
{
  if(err)
   return next(err);
   req.flash("success","Welcome to WanderLust!");
   res.redirect("/listings");

});
  
  }
  catch(e)
  {
    req.flash("error",e.message);
  res.redirect("/signup");

  }

  
}

module.exports.renderLogin=(req,res)=>
{
    res.render("users/login.ejs");
}

module.exports.Login=async(req,res)=>
{
  req.flash("success","Welcome back to WanderLust!");
  let url=res.locals.redirectUrl||"/listings";
  res.redirect(url);


}

module.exports.logout=(req,res)=>
{
  req.logout((err)=>
{
  if(err)
   return next(err);
  req.flash("success","You are Logged out!");
  res.redirect("/listings");

});
}