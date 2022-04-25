var express = require("express");
var router = express.Router();
var Postcontent = require("../models/index");
var Comment = require("../models/comments");
var middleware = require("../middleware");

router.post("/index/:id/comment", middleware.isLoggedIn, function (req, res) {
    Postcontent.findById(req.params.id, function (err, foundPost) {
        if (err) {
            req.flash("error", "Not found");
            res.redirect("/index");
        }
        else {
            Comment.create({ text: req.body.comment }, function (err, createdComment) {
                if (err) {
                    console.log(err);
                }
                else {
                    createdComment.author.id = req.session.user.id;
                    createdComment.author.username = req.session.user.username;
                    createdComment.save();
                    foundPost.comments.push(createdComment);
                    foundPost.save();
                    req.flash("success", "You commented on this Post");
                    res.redirect("/index/" + req.params.id);
                }
            })
        }
    })
});

module.exports = router;