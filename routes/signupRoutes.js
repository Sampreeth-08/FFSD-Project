const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const path=require('path')

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
router.post("/", (req, res, next) => {
    let email = req.body.email.trim();
    let username = req.body.email.trim();
    let password = req.body.password;

    let payload = req.body;
    console.log(payload);
    //payload1={}
    

    if (email && username && password) {

    }
    else {
        //payload1.errorMessage = "Make sure each field has a valid value";
        res.render("signup", payload);
    }

})
module.exports = router;