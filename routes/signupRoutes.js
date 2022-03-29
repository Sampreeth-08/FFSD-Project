const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const mongoose = require("mongoose")
const User = mongoose.model("User");
const validator = require('validator')
const saltrounds = 10

app.use(bodyParser.urlencoded({ extended: false }));

// router.post("/signup", async (req, res, next) => {
//     let email = req.body.email.trim();
//     let username = req.body.email.trim();
//     let password = req.body.password;

//     let payload = req.body;
//     //console.log(payload);    

//     if (email && username && password) {
//         let user=await User.findOne({
//             $or: [
//                 {username: username},
//                 {email: email}
//             ]
//         })
//         .catch((error)=>{
//             console.log(error);
//             payload.errorMessage="Something went wrong";
//             res.status(200).render("signup", payload);
//         });
//         // .then((user)=>{
//         //     console.log(this.user);
//         // })
//         if(user==null){
//             let data=req.body;
//             data.password=await bcrypt.hash(password, 10);
//             User.create(data)
//             .then((user)=>{
//                 //console.log(user);
//                 req.session.user=user;
//                 return res.redirect("/")
//             })
//         }
//         else{
//             if(email==user.email){
//                 payload.errorMessage="Email already in use";
//             }
//             else{
//                 payload.errorMessage="Username already in use";
//             }
//             res.status(200).render("signup", payload);
//         }
//     }
//     else {
//         //payload1.errorMessage = "Make sure each field has a valid value";
//         res.status(200).render("signup", payload);
//     }

// })
// module.exports = router;

// router.get("/signup", (req, res)=>{
//     res.render("signup")
// })

router.post("/signup", (req, res) => {
  const { username, email, password } = req.body;


  const errors = [];

  if (validator.isEmpty(username)) {
    errors.push({
      param: 'username',
      msg: 'UserName is a required field.'
    });
  }

  if (!validator.isEmail(email)) {
    errors.push({
      param: 'email',
      msg: 'Invalid e-mail address.'
    });
  }



  if (validator.isEmpty(password)) {
    errors.push({
      param: 'password',
      msg: 'Password is a required field.'
    });

  }

  try {
    const usernameExists = User.countDocuments({ username: username });
    const emailExists = User.countDocuments({ email: email });

    if (usernameExists === 1) {
      errors.push({
        param: 'username',
        msg: 'Invalid username.'
      });
    }

    if (emailExists === 1) {
      errors.push({
        param: 'email',
        msg: 'Invalid e-mail address.'
      });
    }

  } catch (err) {
    res.json({ error: err });
  }


  if (errors.length > 0) {
    res.json({ errors });
  }
  else {
    bcrypt.hash(password, saltrounds, function (err, hash) {
      const newUser = new User({
        username: username,
        email: email,
        password: hash
      });


      newUser.save(function (err) {
        if (err) {
          console.log(err);
        } else {

          req.session.user = newUser
          console.log("Succesfully registered")
          return res.render("index", { title: newUser.username });
        }
      });



    })
  }

  // res.json({ success: true });

});

module.exports = router