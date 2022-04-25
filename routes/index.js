var express = require("express");
var router = express.Router();
var User = require("../models/users");
var passport = require("passport");
var middleware = require("../middleware");
const bcrypt = require('bcrypt');
var path = require("path"),
    mongoose = require("mongoose");



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
    res.render('edit_profile');
})
router.post('/edit_profile', (req, res, next) => {
    updateRecord(req, res);
})
function updateRecord(req, res) {
    let foundid;
    User.find({ email: req.body.email }).then((result) => {
        // foundid = result[0]._id.toString();
        foundid = result[0]._id
        User.findByIdAndUpdate({ _id: foundid }, {
            username: req.body.username
        }, { new: true }, (err, doc) => {
            if (!err) { res.redirect('/edit_profile'); }
            else {
                console.log('Error during record update : ' + err);
            }
        });
    })

}
module.exports = router;