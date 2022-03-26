const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const path=require('path');
const bcrypt=require('bcrypt');
const User = require('../schemas/UserSchema');

app.use(bodyParser.urlencoded({ extended: false }));

//app.set("view engine", "ejs");
//app.set("views", "views");

router.get("/", (req, res, next) => {
    res.status(200).render("signup")
    //res.status(200).sendFile(path.join(__dirname, "./../views/signup.html"))
})
let payload1={
    errorMessage: "Make sure each field has a valid value"
};
router.post("/", async (req, res, next) => {
    let email = req.body.email.trim();
    let username = req.body.email.trim();
    let password = req.body.password;

    let payload = req.body;
    //console.log(payload);    

    if (email && username && password) {
        let user=await User.findOne({
            $or: [
                {username: username},
                {email: email}
            ]
        })
        .catch((error)=>{
            console.log(error);
            payload.errorMessage="Something went wrong";
            res.status(200).render("signup", payload);
        });
        // .then((user)=>{
        //     console.log(this.user);
        // })
        if(user==null){
            let data=req.body;
            data.password=await bcrypt.hash(password, 10);
            User.create(data)
            .then((user)=>{
                //console.log(user);
                req.session.user=user;
                return res.redirect("/")
            })
        }
        else{
            if(email==user.email){
                payload.errorMessage="Email already in use";
            }
            else{
                payload.errorMessage="Username already in use";
            }
            res.status(200).render("signup", payload);
        }
    }
    else {
        //payload1.errorMessage = "Make sure each field has a valid value";
        res.status(200).render("signup", payload);
    }

})
module.exports = router;