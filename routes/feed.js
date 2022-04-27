var express = require("express");
var router = express.Router();
var Postcontent = require("../models/index");
var User = require("../models/users");
var middleware = require("../middleware");
var path = require("path"),
    multer = require("multer"),
    mongoose = require("mongoose"),
    uuid=require("uuid").v4

var dburl = process.env.DATABASEURL || "mongodb+srv://celestial:celestial@celestialcluster.zrcyq.mongodb.net/CelestialDB?retryWrites=true&w=majority";
var conn = mongoose.createConnection(dburl);

router.get("/camera", middleware.isLoggedIn, function (req, res) {
    res.render("camera");
});



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const id = uuid();
        let data = req.body;
        const filePath = `postimgs/${id}${ext}`;
        const finalData = Object.assign(data, {filePath: filePath})
        const post = new Postcontent(data)
        post.imgPath = filePath
        post.creator.username=req.session.user.username
        post.caption=data.caption
        post.save().then(
            cb(null, filePath)
        )
    }
})
const uploadimg = multer({storage: storage});

router.get("/index", middleware.isLoggedIn, uploadimg.single('file'), function (req, res) {
    Postcontent.find({}).populate("comments").exec(function (err, foundPost) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(foundPost);
            res.render("index", { post: foundPost, currentUser: req.session.user });
            //console.log(foundPost.comments);
        }
    });
});

router.post('/index', middleware.isLoggedIn, uploadimg.single('file'), (req, res) => {
    Postcontent.find({}).populate("comments").exec(function (err, foundPost) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Hellllooo")
            console.log(foundPost);
            console.log(req.session.user);
            res.render("index", { post: foundPost, currentUser: req.session.user });
            //console.log(foundPost.comments);
        }
    });
} )

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

 router.post("/index/:id", middleware.isLoggedIn, function(req, res){
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


 router.get("/discover", middleware.isLoggedIn, function (req, res) {
    Postcontent.find({}, (err, foundPost)=>{
        if (err) {
            console.log(err);
        }
        else {
            //console.log(foundPost);
            res.render("discover", { post: foundPost, currentUser: req.session.user });
            //console.log(foundPost.comments);
        }
    })        
});


module.exports = router;