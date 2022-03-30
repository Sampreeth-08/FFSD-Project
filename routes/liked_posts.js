const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const mongoose = require("mongoose")
const User = mongoose.model("User");

router.get("/", (req, res) => {
    res.render("liked_posts", {
        title: "Liked Posts",
        username: req.session.user.username,
    })
})

module.exports = router