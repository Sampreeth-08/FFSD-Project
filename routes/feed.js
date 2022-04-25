var express = require("express");
var router = express.Router();
var Postcontent = require("../models/index");
var User = require("../models/users");
var middleware = require("../middleware");
var path = require("path"),
    crypto = require("crypto"),
    multer = require("multer"),
    {GridFsStorage} = require("multer-gridfs-storage"),
    Grid = require("gridfs-stream"),
    mongoose = require("mongoose"),
    imageMagic = require("imagemagick");

var dburl = process.env.DATABASEURL || "mongodb+srv://celestial:celestial@celestialcluster.zrcyq.mongodb.net/CelestialDB?retryWrites=true&w=majority";
var conn = mongoose.createConnection(dburl);

let gfs;

conn.once("open", function(){
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads");
});

//middleware for file upload
var storage = new GridFsStorage({
  url: dburl,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

router.get("/index", middleware.isLoggedIn, function(req, res){
    Postcontent.find({}).populate("comments").exec(function(err, foundPost){
       if(err){
           console.log(err);
       } 
       else{
           console.log(foundPost);
           res.render("index", {post: foundPost});
           //console.log(foundPost.comments);
       }
    });
 });

 router.get("/camera", middleware.isLoggedIn, function(req, res){
    res.render("camera"); 
 });    

 router.post("/index", [middleware.isLoggedIn, upload.single("file")], function(req, res){
    //console.log(req.file);
    if(req.file.size<=1048576){
        var uploadedImageName = req.file.filename;
        var creator = {
            id: req.session.user._id,
            username: req.session.user.username,
            //profPic: req.user.imageName
        };
        
        Postcontent.create({
            imageName: uploadedImageName,
            caption: req.body.caption,
            creator: creator
        }, function(err, post){
            if(err){
                console.log(err);
            }
            else{
                //ADD IMAGE NAME TO USER DATA
                User.findOne({username : req.session.user.username}, function(err, foundUser){
                   if(err){
                       console.log(err);
                   } 
                   else{
                       foundUser.pictures.push(uploadedImageName);
                       foundUser.save();
                   }
                });
                req.flash("success", "New post added");
                res.redirect("/index");
            }
        });
    }
    else{
        req.flash("error", "Uploaded file should be less than 1mb..!");
        res.redirect("back");
    }
    
});

router.get("/index/:id", middleware.isLoggedIn, function(req, res){
    Postcontent.findById(req.params.id).populate("comments").exec(function(err, foundPost){
       if(err){
           console.log(err);
       } 
       else{
           res.render("single_post", {post: foundPost});
           //console.log(foundPost);
           //console.log(foundPost.comments);
       }
    });
 });

module.exports=router;