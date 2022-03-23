const express=require('express');
const app=express();
const router=express.Router();
const path=require('path')

router.get("/", (req, res, next)=>{
    console.log(__dirname+"./..views/login.html")
    res.status(200).sendFile(path.join(__dirname, "./../views/login.html"))
    //res.status(200).sendFile(__dirname+"\\views\\login.html");
})
module.exports=router;