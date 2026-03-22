const User = require("../models/User");

// To Signup a user
// To render a form
module.exports.signupForm = (req,res)=>{
     res.render("users/signup.ejs");
};


// To validate username, email, password and if it is valid then to save the credientials in database. 
module.exports.signup = async (req,res,next)=>{
     try{
           let {username, email, password} = req.body;
      const newUser = new User({email,username});
     //   to register this new user into database
          const RegisteredUser = await User.register(newUser,password);
          console.log(RegisteredUser);
          //  To Automatically Login the user it it signups
          req.login(RegisteredUser, (err)=>{
               if(err){
                    next(err);
               }
               req.flash("success", "New User is Registered!");
               res.redirect("/mainListings");
          }) ;
     }catch(e){
           req.flash("error", e.message);
           res.redirect("/signup");
     }
    
};


// To Login a user
// To render a form
module.exports.loginUserForm = (req,res)=>{
       res.render("users/loginUser.ejs");

};



// To validate username, and password and if it is valid then to login the user
// here passport is used to authenticate the user
// here we have just shown the success message
module.exports.login = (req,res)=>{
          req.flash("success","Welcome Back To Wanderlust!!");
          let redirectUrl = res.locals.redirectUrl || "/mainlistings";
          res.redirect(redirectUrl);
      
};



// // To Logout a user
module.exports.logOut = (req,res,next)=>{
      req.logout((err)=>{
           if(err){
               next(err);
           }
      });
      req.flash("success","You are Logged Out !!");
      res.redirect("mainListings");
};