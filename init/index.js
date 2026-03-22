// require mongoose  (require database)
const mongoose = require("mongoose");

// require listing.js (require Schema)
const Listing = require("../models/listing.js");

// require data.js (require data)
const initData = require("./data.js");

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
}

main().then((res)=>{
     console.log("Connected to db");
}).catch((err)=>{
     console.log(err);
});

// function is written to perform insert , delete, etc. operations on data 
const initDB = async ()=>{
    // to delete existing documents from collection
     await Listing.deleteMany({});
     
    //  Adhi yat owner add navta to add karnyasathi
     initData.data = initData.data.map((obj)=>({...obj, owner: "697caa84ddc9bab66312b3eb"}));

    // to add new data stored in data.js , initData madhe apan object  module.exports = { data: sampleListings }; store kela ahe  ani tya object chi key 'data' ahe  ani te object apan data.js madhun export / pass kela ahe
    await Listing.insertMany(initData.data);

    console.log("Data inserted");
}
// call the function initDB();
initDB();
