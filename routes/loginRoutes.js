const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require('../keys')
const requireLogin=require('../middleware/requiredLogin')

app.use(bodyParser.urlencoded({ extended: false }));


const User = mongoose.model("User");

router.get('/protected',requireLogin,(req,res)=>{
    res.send("Hello user")
})

router.post('/login',(req,res)=>{
    console.log(req.body);
    // const {email,password}=req.body
    const email = req.body.username
    const password = req.body.password
    console.log(password);
    if(!email || !password){
        return res.status(422).json({error: "Please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error: "Invalid email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                //res.json({message: "Successfully signed in"})
                const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,username,email}=savedUser
                res.json({token, user:{_id,username,email}})
            }
            else{
                return res.status(422).json({error: "Invalid email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

// router.post("/login", function (req, res) {
//     const username_login = req.body.login_username;
//     const password_login = req.body.login_password;
//     User.findOne({
//         $or: [
//             { username: username_login },
//             { email: username_login }
//         ]
//     }, function (err, foundUser) {
//         if (err) {
//             console.log(err);
//         } else {
//             if (foundUser) {
//                 bcrypt.compare(password_login, foundUser.password, function (err, result) {
//                     if (result === true) {

//                         req.session.user = foundUser
//                         return res.render("index", {
//                             title: username_login,
//                             username: req.session.user.username
//                         });
//                     }
//                     else {
//                         console.log("password is wrong");
//                         res.render("landing");
//                     }
//                 });
//             }
//             else {
//                 console.log("username not found")
//                 res.render("landing")
//             }
//         }
//     });

// })

module.exports = router