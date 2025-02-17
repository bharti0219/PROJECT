const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>
{
    console.log("connected to db");
}).catch((err)=>
{
console.log(err);
});
async function main()
{
   await mongoose.connect(MONGO_URL);
}



const initDB=async()=>
{
     await Listing.deleteMany({});
     initData.data=initData.data.map((obj)=>({
        ...obj,owner : "67a2a01e57e4ced075cf0ddd",
     }));
     initData.data=initData.data.map((obj)=>({
      ...obj,geometry : { type: 'Point', coordinates: [ -79.75994, 43.68589 ] },
   }));
     await Listing.insertMany(initData.data);
     console.log("Data initialised");
}


initDB();