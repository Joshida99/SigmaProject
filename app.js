if (process.env.NODE_ENV !== "production") { require("dotenv").config(); }


// a.express setup
const express = require("express");
 // mongo-store part - 1
// const MongoStore = require('connect-mongo');


const MongoStore = require("connect-mongo").default;
console.log("MongoStore import:", MongoStore);
 // mongo-store part - 2
const store = MongoStore.create({
     mongoUrl:process.env.ATLASDB_URL,
     crypto: {
           secret:process.env.SECRET
     },
     touchAfter: 24 * 3600,
});





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

// I. Require Session
const session = require("express-session");



// J. require flash
const flash = require("connect-flash");

// Database Hosting
const dbUrl = process.env.ATLASDB_URL;

// b. mongoose setup
const mongoose = require("mongoose");
async function main(){
     console.log(process.env.ATLASDB_URL); 
    await mongoose.connect(dbUrl);
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

const ExpressError = require("./Utils/ExpressError.js");


// app.get("/",(req,res)=>{
//         console.dir(req.signedCookies);
//         res.send("Hi! I am Root");
// });



// h. require cookie middleware
//  Signed cookie sathi cookieParser() ya function la String value dyavi lagate 
// Signed cookie ne to data encode hoto 
const cookieParser = require("cookie-parser");
app.use(cookieParser("OK"));
app.get("/getCookie",(req,res)=>{
       res.cookie("greet","Namaste!!!");
       res.cookie("Color","Blueyellow",{signed: true});
       res.send("This is the Cookie!!");
});



//  J. passport to encode messages
 const passport = require("passport");
 const LocalStrategy = require("passport-local");
 const User = require("./models/User");



store.on("error", ()=>{
      console.log("ERROR in Mongo Session Store");
});

// I Sessions
// I.1 define sessionOptions
const sessionOption = {
     store,
     secret: process.env.SECRET,
     resave: false,
     saveUninitialized:  true,
     
     cookie: {
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
          maxAge:  7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
     },
};


app.use(session(sessionOption));
app.use(flash());

//  j- to implement passport
// j1 initialize passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





// --------------------------------------------------------------------------------------------------------------------------------------------




//  To display flash Message
app.use((req,res,next)=>{
       res.locals.success = req.flash("success");
       res.locals.error = req.flash("error");
       res.locals.currUser = req.user;
       next();
});

// ****  Router cha use karun
//  '/mainListings' sathi ****
const mainListingsRouter = require("./Routes/mainListings.js");
app.use("/mainListings",mainListingsRouter);

// ****  Router cha use karun
//  '/mainListings' sathi ****
const ReviewsRouter = require("./Routes/Reviews.js");
app.use("/mainListings/:id/reviews",ReviewsRouter);


// ****  Router cha use karun
//  user signup sathi ****
const userRouter = require("./Routes/user.js");
app.use("/",userRouter);



// -------------------------------------------------------------------------------------------------------------------------------------------



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



