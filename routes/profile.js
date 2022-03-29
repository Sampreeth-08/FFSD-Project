const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const mongoose = require("mongoose")
const User = mongoose.model("User");

router.get("/", (req, res)=>{
    res.render("profile", {
        title: "Profile",
        username: req.session.user.username,
        posts: req.session.user.posts,
        following: req.session.user.following,
        followers: req.session.user.followers,
        bio: req.session.user.bio
    })
})

module.exports = router