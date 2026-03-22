// a.express setup
const express = require("express");
const app = express();

// c.ejs setup
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

// f.require ejs-mate for styling the pages
const ejsMate = require("ejs-mate");
app.engine("ejs",ejsMate);

//g. to apply style.css
app.use(express.static(path.join(__dirname,"./public")))

app.listen(8080,"localhost",()=>{
        console.log("app is listening to port 8080");
});

//h. For Server Side Validation of Listings Using Joi
const {listingSchema} = require("./validateSchema.js");

//  h.1 Lets covert Joi Validation into Middleware
const ValidatePlace = (req,res,next)=>{
       let {error} =  listingSchema.validate(req.body.updatePlace);

           if(error){         // This means if there is any error in our result then
                  throw new ExpressError(400,error);
           }
                next();
}

// I. For Serverside validation of reviews using JOI
const {reviewSchema} = require("./validateSchema.js");
// I.1 Lets covert Joi Validation into Middleware
const validateReview = (req,res,next)=>{
       let {error} =  reviewSchema.validate(req.body.reviews);
           if(error){         // This means if there is any error in our result then
                  throw new ExpressError(400,error);
           }
          next();
}

// b. mongoose setup
const mongoose = require("mongoose");

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
}

main().then((res)=>{
     console.log("Connected to db");
}).catch((err)=>{
     console.log(err);
});

// install method override
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// d.setup for getting form data
app.use(express.urlencoded({extended: true}));

// e. access the module (model)
const ListingModel = require("./models/listing.js");

// e. access the module (wrapAsync)
const wrapAsync = require("./Utils/wrapAsync.js");

const ExpressError = require("./Utils/ExpressError.js");

// f.access the module for Review (model)
const Review = require("./models/review.js");
const Listing = require("./models/listing.js");



// app.get("/getCookie",(req,res)=>{
//        res.send("This is the Cookie!!");
// });


// 1.Index Route
app.get("/mainListings",wrapAsync(async (req,res)=>{
    const allListings =  await ListingModel.find({});
     res.render("./Listings/index.ejs",{allListings});
}));

// 3.1 new listing 
app.get("/mainListings/new",(req,res)=>{
      res.render("./Listings/new.ejs");
});
//3.2 create  route (add new place)
app.post("/mainListings/addListing" ,ValidatePlace, wrapAsync(async (req,res,next)=>{         
            const addNewPlace = new ListingModel(req.body.newPlace);
            await addNewPlace.save();
            res.redirect("/mainListings");
 
}));

//2 Show Route
app.get("/mainListings/:id",wrapAsync(async (req,res)=>{
      let {id} = req.params;
      const dataOfId = await ListingModel.findById(id).populate("reviews");
      res.render("./Listings/show.ejs",{dataOfId});
}));

// 4.1  Route
app.get("/mainListings/:id/update", wrapAsync(async (req,res)=>{
     console.log("place");
     // console.log("Body:", req.body);

     let {id} = req.params;
     const place = await ListingModel.findById(id);
     console.log(place);
     res.render("./Listings/update.ejs",{place});
}));
// 4.2 update in db
app.put("/mainListings/:id", wrapAsync(async(req,res)=>{
         let {id} = req.params;
         const updatePlace = await ListingModel.findByIdAndUpdate(id,{ ...req.body.updatePlace });
         res.redirect(`/mainListings/${id}`);
}));

// 5.1 delete route
app.get("/mainListings/:id/delete", wrapAsync(async (req,res)=>{
      let {id} = req.params;
      let deletePlace = await ListingModel.findByIdAndDelete(id);
      console.log(deletePlace);
      res.redirect("/mainListings");
}));


// 6.1 Review Route reviewPlace=listing , 
app.post("/mainListings/:id/reviews",validateReview,wrapAsync (async(req,res)=>{
     //   we are finding the place by using its ID
     let reviewPlace = await ListingModel.findById(req.params.id);
     let newReview = new Review({
           rating: req.body.Review.rating,
           comment: req.body.Review.comment 
          });

     reviewPlace.reviews.push(newReview._id);
     await newReview.save(); 
     await reviewPlace.save(); 

     console.log("New Review Added"); 
     res.redirect(`/mainListings/${reviewPlace._id}`);
}));

// 6.2 Delete Review Route
app.delete("/mainListings/:id/reviews/:reviewId",wrapAsync( async (req,res)=>{
      let {id,reviewId} = req.params;

      await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
      await Review.findByIdAndDelete(reviewId);
     //  res.redirect("/listings/:id/");
       res.redirect(`/mainListings/${id}`);

}))



// 
// app.use((err,req,res,next)=>{
//        res.send("Something Went Wrong!!");
// });

//  for all incorrect requests
// app.all("*",(req,res,next))=>{
//       next(new ExpressError(404,"Page not found!"));
// });

//  for all incorrect requests
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});
//  Throw error using express error
app.use((err,req,res,next)=>{
     // res.send("Error........!");
     let {statusCode=500,message="Something Went Wrong!"} = err;
     //   res.status(statusCode).send(message);

     res.status(statusCode).render("error.ejs",{message});
});



