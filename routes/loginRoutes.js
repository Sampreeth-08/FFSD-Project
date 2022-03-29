// const express = require('express');
// const app = express();
// const router = express.Router();
// const path = require('path')
// const bodyParser = require("body-parser");
// const bcrypt=require('bcrypt');
// const User = require('../models/User');

// app.set("view engine", "ejs");
// app.set("views", "views");

// app.use(bodyParser.urlencoded({ extended: false }));

// router.get("/", (req, res, next) => {
//     res.status(200).render("login")
// })

// router.post("/", async (req, res, next) => {
//     let payload = req.body;
//     if(req.body.username && req.body.password){
//         let user=await User.findOne({
//             $or: [
//                 {username: req.body.username},
//                 {email: req.body.username}
//             ]
//         })
//         .catch((error)=>{
//             console.log(error);
//             payload.errorMessage="Something went wrong";
//             res.status(200).render("login", payload);
//         });

//         if(user!=null){
//             let result=await bcrypt.compare(req.body.password, user.password);
//             if(result===true){
//                 req.session.user=user;
//                 return res.redirect("/");
//             }
//         }
//         payload.errorMessage="Login credentials Incorrect";
//         return res.status(200).render("login", payload);
//     }
//     payload.errorMessage="Make sure each field has a valid value";
//     res.status(200).render("login")
// })
// module.exports = router;


const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const mongoose = require("mongoose")
const User = mongoose.model("User");

router.post("/login",function(req,res){
    const username_login = req.body.login_username;
    const password_login =req.body.login_password;
    User.findOne({
        $or: [
            {username: username_login},
            {email: username_login}
        ]
    }, function(err, foundUser){
    if (err) {
        console.log(err);
    } else {
        if (foundUser) {
        bcrypt.compare(password_login, foundUser.password, function(err, result) {
            if(result === true){
                
                req.session.user = foundUser
                return res.render("index",{
                    title:username_login,
                    username:req.session.user.username
                });
            }
            else{
                console.log("password is wrong");
                res.render("landing");
            }  
        });
    } 
        else{
            console.log("username not found")
            res.render("landing")
        }
    }
    });

})

module.exports = router