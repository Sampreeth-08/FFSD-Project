const express = require('express');
const app = express();
const router = express.Router();
const path = require('path')
const bodyParser = require("body-parser");
const bcrypt=require('bcrypt');
const User = require('../schemas/UserSchema');

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {
    res.status(200).render("login")
    //res.status(200).render(path.join(__dirname, "./../views/login"))
})

router.post("/", async (req, res, next) => {
    let payload = req.body;
    if(req.body.username && req.body.password){
        let user=await User.findOne({
            $or: [
                {username: req.body.username},
                {email: req.body.username}
            ]
        })
        .catch((error)=>{
            console.log(error);
            payload.errorMessage="Something went wrong";
            res.status(200).render("login", payload);
        });

        if(user!=null){
            let result=await bcrypt.compare(req.body.password, user.password);
            if(result===true){
                req.session.user=user;
                return res.redirect("/");
            }
        }
        payload.errorMessage="Login credentials Incorrect";
        return res.status(200).render("login", payload);
    }
    payload.errorMessage="Make sure each field has a valid value";
    res.status(200).render("login")
})
module.exports = router;