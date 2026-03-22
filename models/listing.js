const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

// async function main(){
//     await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
// }

// main().then((res)=>{
//      console.log("Connected to db");
// }).catch((err)=>{
//      console.log(err);
// });

const listingSchema = new Schema({
        title: {
            type:String,
            required: true,
        },
        description: String,
        image: {
             type: String,
             default:"https://unsplash.com/photos/the-sun-is-setting-over-a-city-with-palm-trees-kThtmOphCs4",
             set: (v) => 
               v === "" 
               ? "https://unsplash.com/photos/the-sun-is-setting-over-a-city-with-palm-trees-kThtmOphCs4"
               : v, 
        },
        price: Number,
        location: String,
        country: String,
        reviews: [
          {
                type: Schema.Types.ObjectId,
                ref: "Review",

          },
        ],
        owner: {
               type: Schema.Types.ObjectId,
               ref: "User",
        },
});


listingSchema.post("findOneAndDelete", async ()=>{
        if(Listing){       // jar listing (place) delete keli tar
               await Review.deleteMany({_id: {$in: Listing.reviews}});  // tya listing vaer jevadhe reviews hote te delete karave (deleteMany).
               // review delete karayachi request ali ki he mdddleware run honar and tya listing(place)chya id var jevadhe reviews ahet te delete karavet.
        }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;