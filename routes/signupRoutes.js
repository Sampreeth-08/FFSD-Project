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

router.get('/', (req, res) => {
  res.send("Celestial")
})

router.post('/signup', (req, res) => {
  const username = req.body.signup_username;
  const email = req.body.signup_email;
  const password = req.body.signup_password;

  console.log(req.body);
  if (!email || !password || !username) {
    return res.status(422).json({ error: "Please add all the fields" })
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "User already exists with that email" })
      }
      bcrypt.hash(password, 12)
        .then(hashedpassword => {
          const user = new User({
            username,
            email,
            password: hashedpassword
          })
          user.save()
            .then(user => {
              //res.json({ message: "Saved successfully" })
              res.redirect("login")
            })
            .catch(err => {
              console.log(err)
            })
        })
    })
    .catch(err => {
      console.log(err)
    })
})

// router.post("/signup", (req, res) => {
//   const { username, email, password } = req.body;


//   const errors = [];

//   if (validator.isEmpty(username)) {
//     errors.push({
//       param: 'username',
//       msg: 'UserName is a required field.'
//     });
//   }

//   if (!validator.isEmail(email)) {
//     errors.push({
//       param: 'email',
//       msg: 'Invalid e-mail address.'
//     });
//   }



//   if (validator.isEmpty(password)) {
//     errors.push({
//       param: 'password',
//       msg: 'Password is a required field.'
//     });

//   }

//   try {
//     const usernameExists = User.countDocuments({ username: username });
//     const emailExists = User.countDocuments({ email: email });

//     if (usernameExists === 1) {
//       errors.push({
//         param: 'username',
//         msg: 'Invalid username.'
//       });
//     }

//     if (emailExists === 1) {
//       errors.push({
//         param: 'email',
//         msg: 'Invalid e-mail address.'
//       });
//     }

//   } catch (err) {
//     res.json({ error: err });
//   }


//   if (errors.length > 0) {
//     res.json({ errors });
//   }
//   else {
//     bcrypt.hash(password, saltrounds, function (err, hash) {
//       const newUser = new User({
//         username: username,
//         email: email,
//         password: hash
//       });


//       newUser.save(function (err) {
//         if (err) {
//           console.log(err);
//         } else {

//           req.session.user = newUser
//           console.log("Succesfully registered")
//           return res.render("index", { title: newUser.username });
//         }
//       });



//     })
//   }

//   // res.json({ success: true });

// });

module.exports = router