var express = require("express");
var router = express.Router();
var Postcontent = require("../models/index");
var User = require("../models/users");
var middleware = require("../middleware");
var path = require("path"),
    multer = require("multer"),
    mongoose = require("mongoose"),
    uuid = require("uuid").v4

var dburl = process.env.DATABASEURL || "mongodb+srv://celestial:celestial@celestialcluster.zrcyq.mongodb.net/CelestialDB?retryWrites=true&w=majority";
var conn = mongoose.createConnection(dburl);

router.get("/camera", middleware.isLoggedIn, function (req, res) {
    res.render("camera");
});

let id1
let post
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const id = uuid();
        let data = req.body;
        const filePath = `postimgs/${id}${ext}`;
        const finalData = Object.assign(data, { filePath: filePath })
        post = new Postcontent()
        post.imgPath = filePath
        post.creator.username=req.session.user.username
        post.creator.id=req.session.user._id
        post.caption=data.caption
        console.log('hi');
        console.log(data);
        console.log(data.caption);
        post.save().then(
            cb(null, filePath)
        )
        id1 = post._id
    }
})
const upload = multer({ storage: storage });

router.get("/index", middleware.isLoggedIn, function (req, res) {
    Postcontent.find({}).populate("comments").exec(function (err, foundPost) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(foundPost);
            console.log(foundPost);
            res.render("index", { post: foundPost, currentUser: req.session.user });
            //console.log(foundPost.comments);
        }
    });
});

router.post('/index', middleware.isLoggedIn, upload.single('file'), (req, res) => {
    Postcontent.findByIdAndUpdate(id1)
        .exec((err, foundPost) => {
            if(err) {
                console.log(err);
            } else {
                // console.log('sam');
                // console.log(foundPost);
                // console.log(req.body.caption);
                foundPost.caption = req.body.caption
                foundPost.save()
            }
        })
    console.log('hey');
    console.log(req.body.caption);
    Postcontent.find({}).populate("comments").exec(function (err, foundPost) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log("Hellllooo")
            // console.log(foundPost);
            // console.log(req.session.user);
            res.render("index", { post: foundPost, currentUser: req.session.user });
            //console.log(foundPost.comments);
        }
    });
})

router.get("/index/:id", middleware.isLoggedIn, function (req, res) {
    Postcontent.findById(req.params.id).populate("comments").exec(function (err, foundPost) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("single_post", { post: foundPost, currentUser:req.session.user });
            //console.log(foundPost);
            //console.log(foundPost.comments);
        }
    });
});

router.post("/index/:id", middleware.isLoggedIn, function (req, res) {
    Postcontent.findById(req.params.id).populate("comments").exec(function (err, foundPost) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("single_post", { post: foundPost, currentUser:req.session.user });
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