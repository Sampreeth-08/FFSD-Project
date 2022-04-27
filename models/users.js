var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
   username: String,
   email: String,
   password: String,
   profPic:{
      type: String,
      default: "/img/2.png"
  },
   pictures: []
});

module.exports = mongoose.model("User", userSchema);