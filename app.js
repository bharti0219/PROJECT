if(process.env.NODE_ENV!="production")
{
    require('dotenv').config(); 
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");

const dbUrl=process.env.ATLAS_DB_URL;
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const listingRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/reviews.js");
const userRouter=require("./routes/User.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
//const cookie_parser = require("cookie-parser");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); //to parse the data from request
app.use(methodOverride("_method")); //to convert post request to put 
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


//app.use(cookie_parser("secretCode"));

main().then(()=>
{
    console.log("connected to db");
}).catch((err)=>
{
console.log(err);
});
async function main()
{
   await mongoose.connect(dbUrl);
}


const store= MongoStore.create(
    {
        mongoUrl: dbUrl,
        crypto: {
            secret: process.env.SECRET,
          },
        touchAfter:24*60*60,

    }
);
store.on("error",()=>
{
    console.log("Error in mongo session store" ,err);

});


const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:
    {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,

    },

};





// app.get("/",(req,res)=>
// {
//     res.send("I m root");
// });


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>
{
   res.locals.msg=req.flash("success");
   res.locals.error=req.flash("error");
   res.locals.user=req.user;
   next();
})




app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);
// app.get("/testListing",async(req,res)=>
// {
//     let sampleListing=new Listing(
//         {
//             title:"My New Villa",
//             description:"By the Beach",
//             price:500,
//             loaction:"Toronto",
//             country:"Canada"
        
//         }
//     );
//     await sampleListing.save();
//     console.log("Sample saved");
//     res.send("success testing");

// });




app.all("*",(req,res,next)=>
{
   next(new ExpressError(404,"page not Found!"));
});

app.use((err,req,res,next)=>
{
    let {status=500,message="something went wrong"}=err;
    res.status(status).render("error.ejs",{message});

    // res.status(status).send(message);
})


app.listen(9090,()=>
{
    console.log("server is listening at port 9090");
});
