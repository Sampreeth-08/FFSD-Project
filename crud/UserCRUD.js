const express = require("express")
const ejs = require('ejs');
const mongoose = require('mongoose')
const router = express.Router();
const Post = mongoose.model("Post")
const requiredLogin = require("../middleware/requiredLogin");

router.post("/update", (req, res) => {
  // console.log("Hello");
  alert("Hello");
  User.updateOne(
    { email: req.body.email },
    {
      $set: {
        email: req.body.email,
        username: req.body.username,
        bio: req.body.bio
      }
    },
    {
      upsert: true
    },
    function (err) {
      if (!err) {
        res.send("succesfully updated article");
      }
      else {
        res.send(err);
      }
    })
  // User.findOneAndUpdate(
  //     {username: req.session.user.username},
  //     {
  //         email: req.body.email,
  //         username: req.body.username,
  //         bio: req.body.bio
  //     }
  // ),
})

module.exports = router