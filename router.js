const express = require("express")
const ejs = require('ejs');
const mongoose = require('mongoose')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = mongoose.model("User");
//const Post = mongoose.model("Post");
const bcrypt = require('bcrypt')
const saltrounds = 10;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const req = require("express/lib/request");
JWT_SECRET=process.env.JWT_SECRET.toString()
const session = require('express-session');
const requiredLogin = require("./middleware/requiredLogin");

router.get("/",function(req,res){
    res.render("landing")
})
  
router.get("/index", function(req,res){
    console.log(req.headers.cookie)
     res.render("index",{title:req.session.user.username})
})
  
  
  
//   router.get("/404",function(req,res){
//     console.log(req.session.user.username)
//     res.render("404");
//   });
  
  
  
  
  

  
  







module.exports = router