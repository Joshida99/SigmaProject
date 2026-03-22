const express = require("express");
const router = express.Router({mergeParams: true});

// e. access the module (model)
const ListingModel = require("../models/listing.js");
// e. access the module (wrapAsync)
const wrapAsync = require("../Utils/wrapAsync.js");


// To check whether user is logged in or not
const {isLoggedIn,isOwner,ValidatePlace} = require("../middleware.js");



//  To Require the Controller
const listingController = require("../Controllers/listingController.js");









 


// 1.Index Route [mainlistings]
router.get("/",wrapAsync(listingController.mainlistings));

// 3.1 new listing [newPlace]
router.get("/new",isLoggedIn,listingController.newPlace);


//3.2 create  route (add new place)  [addListing] 
router.post("/addListing" ,ValidatePlace,isLoggedIn, wrapAsync(listingController.addListing));


router.route("/:id")
    .get(wrapAsync(listingController.showPlace))   //2 Show Route [showPlace]
    .put(isLoggedIn,isOwner,wrapAsync(listingController.updateInDB))   // 4.2 update in db [updateInDB]
    .delete(isLoggedIn,isOwner, wrapAsync(listingController.deletePlace));


// //2 Show Route [showPlace]
// router.get("/:id",wrapAsync(listingController.showPlace));

// 4.1 Update Route [updatePlace]
router.get("/:id/update", isLoggedIn,isOwner,wrapAsync(listingController.updatePlace));

// // 4.2 update in db [updateInDB]
// router.put("/:id", isLoggedIn,isOwner,wrapAsync(listingController.updateInDB));


// // 5.1 delete route [deletePlace]
// router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.deletePlace));

module.exports = router;