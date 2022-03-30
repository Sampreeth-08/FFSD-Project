const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const mongoose = require("mongoose")
const User = mongoose.model("User");
const Post = mongoose.model("Post");
const validator = require('validator')

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/",(req,res)=>{
    console.log(req.session.user.username)
    User.find({_id:req.params.UserId}, function(err, post){
      //console.log(post)
      res.render("camera", {
        title:req.session.user.username,
        username:req.session.user.username
      });
    });
  })

router.post("/",(req,res)=>{
    const { image, caption, hashtags } = req.body;
    const errors = [];

    if(String(caption).length>200 || String(hashtags).length>200){
        errors.push({
            param: 'username',
            msg: 'Caption/hashtag is too long'
        });
    }

    if(errors.length>0){
        res.json({errors});
    }
    else{
        const newPost =  new Post({
            username: req.session.user.username,
            caption: req.body.caption,
            hashtags: req.body.hashtags,
            likes: 0,
            profile_image: req.session.user.profilePic,
            image: String(req.body.image)
        });

        newPost.save(function(err){
            if (!err){
                res.render("camera", {
                    successMsg: "Post created successfully",
                    image: req.body.image
                });
                console.log("Post created successfully!!")
              }
              else{
                res.render("camera", {errorMsg: "Caption/hashtag is too long"});
                console.log("Error occurred!!")
                console.log(err);
              }
        });
    }


  
  
    
    
    
    });

module.exports = router