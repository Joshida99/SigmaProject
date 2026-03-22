const ListingModel = require("../models/listing");
const Review = require("../models/review");



// 6.1 Review Route reviewPlace=listing , To Add the new Review
module.exports.createReview   =  async(req,res)=>{
     //   we are finding the place by using its ID
     let reviewPlace = await ListingModel.findById(req.params.id);
     let newReview = new Review(req.body.Review);
     newReview.author = req.user._id;
     console.log(newReview);

     reviewPlace.reviews.push(newReview._id);

     await newReview.save(); 
     await reviewPlace.save(); 

     console.log("New Review Added");
     req.flash("success",`New Review Added!!`); 
     res.redirect(`/mainListings/${reviewPlace._id}`);
};



// 6.2 Delete Review Route
module.exports.deleteReview = async (req,res)=>{
      let {id,reviewId} = req.params;

      await ListingModel.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
      await Review.findByIdAndDelete(reviewId);
     //  res.redirect("/listings/:id/");
     req.flash("success",` Review Deleted!!`);
       res.redirect(`/mainListings/${id}`);

};