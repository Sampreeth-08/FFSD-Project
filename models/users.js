var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
   username: String,
   email: String,
   password: String,
   profPic: String,
   pictures: [],
   following: [],
   followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model("User", userSchema);