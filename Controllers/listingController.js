const ListingModel = require("../models/listing");



// 1.Index Route [mainlistings]
module.exports.mainlistings = async (req,res)=>{
    const allListings =  await ListingModel.find({});
     res.render("./Listings/index.ejs",{allListings});
};
   
// 3.1 new listing [newPlace]
module.exports.newPlace = (req,res)=>{      
      res.render("./Listings/new.ejs");
};


//3.2 create  route (add new place)  [addListing]
module.exports.addListing = async (req,res,next)=>{         
            const addNewPlace = new ListingModel(req.body.newPlace);
            console.log(req.user);
            addNewPlace.owner = req.user._id;
            await addNewPlace.save();
            req.flash("success","New Place is Added!!");
            res.redirect("/mainListings");
};


//2 Show Route [showPlace]
module.exports.showPlace = async (req,res)=>{
      let {id} = req.params;
      const dataOfId = await ListingModel
                              .findById(id)
                              .populate({path: "reviews", populate: {path: "author"}})
                              .populate("owner");

      if(!dataOfId){
             req.flash("error",`Place Does Not Exist!!`);
             res.redirect("/mainListings");
      }
      console.log(dataOfId);
      res.render("./Listings/show.ejs",{dataOfId});
};




// 4.1 Update Route [updatePlace]
module.exports.updatePlace = async (req,res)=>{
     console.log("place");
     // console.log("Body:", req.body);

     let {id} = req.params;
     const place = await ListingModel.findById(id);
//      console.log(place);
     if(!place){
       req.flash("error",`Could not Update. Place Does Not Exist!!`);
             res.redirect("/mainListings");
      }
      else{
            res.render("./Listings/update.ejs",{place});
      }     
};




// 4.2 update in db [updateInDB]
module.exports.updateInDB = async(req,res)=>{
         let {id} = req.params;
         const updatePlace = await ListingModel.findByIdAndUpdate(id,{ ...req.body.updatePlace });
         req.flash("success",`Listing Updated!!`);
         res.redirect(`/mainListings/${id}`);
};





// 5.1 delete route [deletePlace]
module.exports.deletePlace = async (req,res)=>{
      let {id} = req.params;
      let deletePlace = await ListingModel.findByIdAndDelete(id);
      console.log(deletePlace);
      req.flash("success",`Listing Deleted!!`);
      res.redirect("/mainListings");
};
