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