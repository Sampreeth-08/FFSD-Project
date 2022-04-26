var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
   username: String,
   email: String,
   password: String,
   profPic: String,
   pictures: []
});

module.exports = mongoose.model("User", userSchema);