// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const passportLocalMongoose = require("passport-local-mongoose");

// const userSchema = new Schema({
//      email: {
//          type: String,
//          required: true
//      },
// });

// userSchema.plugin(passportLocalMongoose);console.log(typeof passportLocalMongoose); // should print "function"

// module.exports = mongoose.model("User",userSchema);

const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;
// console.log("passport-local-mongoose type:", typeof passportLocalMongoose);

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  }
});

UserSchema.plugin(passportLocalMongoose);
// console.log(typeof passportLocalMongoose); 


module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
