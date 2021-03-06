var express = require("express");
var router = express.Router();
var User = require("../models/users");
var middleware = require("../middleware");
const bcrypt = require('bcrypt');
var Postcontent = require("../models/index");
var path = require("path"),
    mongoose = require("mongoose");
multer = require("multer")



var dburl = process.env.DATABASEURL || "mongodb+srv://celestial:celestial@celestialcluster.zrcyq.mongodb.net/CelestialDB?retryWrites=true&w=majority";
var conn = mongoose.createConnection(dburl);


router.get("/", function (req, res) {
    res.render("signup");
});

router.get("/signup", function (req, res) {
    res.render("signup");
});

router.post("/signup", async (req, res, next) => {
    let email = req.body.email.trim();
    let username = req.body.email.trim();
    let password = req.body.password;

    if (email && username && password) {
        let user = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        })
            .catch((error) => {
                console.log(error);
                payload.errorMessage = "Something went wrong";
                res.status(200).render("signup", { error: "Something went wrong" });
            });
        // .then((user)=>{
        //     console.log(this.user);
        // })
        if (user == null) {
            let data = req.body;
            data.password = await bcrypt.hash(password, 10);
            User.create(data)
                .then((user) => {
                    //console.log(user);
                    req.session.user = user;
                    return res.redirect("/index")
                })
        }
        else {
            if (email == user.email) {
                // payload.errorMessage="Email already in use";
            }
            else {
                payload.errorMessage = "Username already in use";
            }
            res.status(200).render("signup", payload);
        }
    }
    else {
        //payload1.errorMessage = "Make sure each field has a valid value";
        res.status(200).render("signup", payload);
    }

})

router.get("/login", function (req, res) {
    res.render("login");
});

router.post("/login", (req, res, next) => {
    //let payload = req.body;
    // console.log(req.body);
    if (req.body.email && req.body.password) {
        User.findOne({
            $or: [
                { username: req.body.email },
                { email: req.body.email }
            ]
        }, (err, data) => {
            if (err) {
                console.log(err);
            }
            console.log(data);
            if (data) {

                bcrypt.compare(req.body.password, data.password, (err, result) => {
                    if (result === true) {
                        console.log("hgtfvthh");
                        req.session.user = data;
                        return res.redirect("/index");
                    }
                });

            }
        })
        // .catch((error)=>{
        //     console.log(error);
        //     res.status(200).render("login", {error: "Something went wrong"});
        // });


        //payload.errorMessage="Login credentials Incorrect";
    }
    //payload.errorMessage="Make sure each field has a valid value";
    // res.status(200).render("login")
});

router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Successfully logged out");
    res.redirect("/");
});
let query = '';
router.get("/search/:name", (req, res) => {
    let regex = new RegExp(req.params.name, 'i');
    User.find({ username: regex }).then((result) => {
        res.render('search', { x: result })
    })
})
router.post('/search', (req, res) => {
    query = req.body.search;
    if (query != '') {
        query = 'search/' + query;
        res.redirect(query)
    }
    else {
        res.redirect('/index')
    }
})

router.get('/edit_profile', (req, res) => {
    //console.log(req.session.user);
    res.render('edit_profile', { currentUser: req.session.user });
})

let id2
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
        user = new User()
        user.profPic = filePath
        user.username = data.username
        user.email = data.email
        // console.log('hi');
        // console.log(data);
        // console.log(data.caption);
        post.save().then(
            cb(null, filePath)
        )
        id2 = user._id
    }
})
const upload = multer({ storage: storage });

router.post('/edit_profile', middleware.isLoggedIn, upload.single('file'), (req, res) => {
    //updateRecord(req, res);
    // User.findByIdAndUpdate(id2)
    //     .exec((err, foundUser)=>{
    //         if(err) {
    //             console.log(err);
    //         } else {
    //             if(req.body.username){
    //                 foundUser.username=req.body.username
    //             }
    //             if(req.body.email){
    //                 foundUser.email=req.body.email
    //             }
    //             if(req.body.bio){
    //                 foundUser.email=req.body.bio
    //             }
    //             foundUser.save()
    //         }
    //     })

    updateRecord(req, res)
})
function updateRecord(req, res) {
    let foundid;
    User.find({ email: req.body.email }).then((result) => {
        foundid = result[0]._id
        User.findByIdAndUpdate({ _id: foundid }, {
            username: req.body.username,
            bio: req.body.bio
        }, { new: true }, (err, doc) => {
            if (!err) { res.redirect('/edit_profile'); }
            else {
                console.log('Error during record update : ' + err);
            }
        });
    })

}


router.get("/:id/profile", middleware.isLoggedIn, function (req, res) {
    Postcontent.find({ "creator.id": req.session.user.id }, (err, foundPost) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("profile", { post: foundPost, currentUser: req.session.user })
        }
    })
})

router.get("/:id/profile", middleware.isLoggedIn, function (req, res) {
    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            console.log(err);
        }
        else {
            Postcontent.find({ "creator.id": req.params.id }), function (err, foundPost) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.render("user_profile", { user: foundUser, post: foundPost });
                }
            }

        }
    });
});


router.get('/adminlogin', (req, res) => {
    res.render('admin');
})
router.post('/adminlogin', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (email === 'ganajayant28@gmail.com' && password === 'ganajayant28') {
        User.find({}).then((result) => {
            res.render('userlist', { x: result })
        })
    }
    else {
        res.redirect('adminlogin');
    }
})
router.post('/customerdelete/:_id', (req, res) => {
    User.findOneAndRemove({ _id: req.params._id }, function (err) {
        if (err) {
            console.log(err.message);
            User.find({}).then((result) => {
                res.render('userlist', { x: result })
            })
        }
        else {
            User.find({}).then((result) => {
                res.render('userlist', { x: result })
            })
        }
    });
})
module.exports = router;