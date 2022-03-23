const express=require('express');
const app=express();
const router=express.Router();
const bodyParser=require("body-parser");

app.use(bodyParser.urlencoded({extended: false}));

router.get("/", (req, res, next)=>{
    res.status(200).sendFile("/signup.html");
})
router.post("/", (req, res, next)=>{
    var email=req.body.email.trim();
    var username=req.body.email.trim();
    var password=req.body.password;

    var payload=req.body;

    if(email && username && password){

    }
    else{
        payload.errorMessage="Make sure each field has a valid value";
        res.status(200).sendFile("/signup.html", payload);
    }

})
module.exports=router;