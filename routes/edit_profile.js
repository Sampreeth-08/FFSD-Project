const express = require("express")
const ejs = require('ejs');
const mongoose = require('mongoose')
const router = express.Router();
const User = mongoose.model("User")



router.get("/", (req, res) => {
  console.log(req.session.user.username)
  User.find({ _id: req.params.UserId }, function (err, post) {
    console.log(post)
    res.render("edit_profile", {
      title: req.session.user.username,
      username: req.session.user.username
    });
  });
})

module.exports = router