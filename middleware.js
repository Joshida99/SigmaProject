// isOwner sathi
const ListingModel = require("./models/listing");


// ValidatePlace sathi 
const ExpressError = require("./Utils/ExpressError.js");
//h. For Server Side Validation of Listings Using Joi
const {listingSchema} = require("./validateSchema.js");


// for validateReview
// I. For Serverside validation of reviews using JOI
const {reviewSchema} = require("./validateSchema.js");


// isReviewAuthor sathi
// f.access the module for Review (model)
const Review = require("./models/review.js");





module.exports.isLoggedIn = (req,res,next)=>{
    console.log(req.user);
    if(!req.isAuthenticated()){

        //  jar user loggdin nasel tar apan tyala login karatoy pn login kelyavar to mainlistings la jatoy , pn jar aplyala (create new place la jayachay / updatePlace la jayachay ) tar mag aplyala parat mainlisting varun java lagtay ,
        // tar he avoid karnyasathi apan jevha (newPlace var janar ani  tithe login karanar / updateplace la janar ani tithe login karanar). tevha apan to jo kahi path ahe to "req" ya object chya "originalUrl" ya variable madhe to path automatically storezalela asto 
        //  so, jar user loggedin nasel tar apan tya path la redirect karanar  

        req.session.redirectUrl = req.originalUrl;

        req.flash("error","You are not Logged in !!");
        return res.redirect("/loginUser");
     }
     next();
}

//  jevha user login karto tevha passport apala session reset karto tymule tyatli originalUrl delete houn jate 
//  so ti url aplyala save karavi lagel, so apan agodar tyasathi ek middleware banavanar ani tyat .....
// tyamule ti url apan locals chya variable madhe store keli ji login tya tithe apan accsess karun use kau shakto

module.exports.saveRedirectUrl = (req,res,next)=>{
     if(req.session.redirectUrl){
         res.locals.redirectUrl = req.session.redirectUrl;
     }
     next();
}

module.exports.isOwner = async (req,res,next)=>{
         let {id} = req.params;
         let place = await ListingModel.findById(id);

         if(!place.owner._id.equals(res.locals.currUser._id)){
             req.flash("error",`Permission Denied!!!!`);
             return res.redirect(`/mainListings/${id}`);
         }
         next();
}

//  h.1 Lets covert Joi Validation into Middleware validatePlaceSchema
module.exports.ValidatePlace = (req,res,next)=>{
       let {error} =  listingSchema.validate(req.body.updatePlace);

           if(error){         // This means if there is any error in our result then
                  throw new ExpressError(400,error);
           }
                next();
}

// I.1 Lets covert Joi Validation into Middleware to validateReview
module.exports.validateReview = (req,res,next)=>{
       let {error} =  reviewSchema.validate(req.body.reviews);
           if(error){         // This means if there is any error in our result then
                  throw new ExpressError(400,error);
           }
          next();
}

// to validate whether loggedinUser is author of the review
 
module.exports.isReviewAuthor = async (req,res,next)=>{
         let {id,reviewId} = req.params;
         let review = await Review.findById(reviewId);

         if(!review.author._id.equals(res.locals.currUser._id)){
             req.flash("error",`You are not the author of this review !!`);
             return res.redirect(`/mainListings/${id}`);
         }
         next();
}