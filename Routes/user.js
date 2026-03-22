// express setup
const express = require("express");
const router =  express.Router();
// const app = express();
// const User = require("../models/user.js");
const wrapAsync = require("../Utils/wrapAsync");
const passport = require("passport");

//  To save originalUrl
const { saveRedirectUrl } = require("../middleware.js");



// To require userController
const userController = require("../Controllers/userController.js");

// To Signup a user
router.route("/signup")
        .get(userController.signupForm)    // To render a form
                // To validate username, email, password and if it is valid then to save the credientials in database. 
        .post( wrapAsync(userController.signup));



// To Login a user
router.route("/loginUser")
        // To render a form
.get(userController.loginUserForm)
        
        // To validate username, and password and if it is valid then to login the user
        //here passport is used to authenticate the user
.post(saveRedirectUrl, passport.authenticate("local",{failureRedirect: '/loginUser',failureFlash: true }) ,userController.login);


// To Logout a user
router.get("/logoutUser",userController.logOut);

module.exports = router;