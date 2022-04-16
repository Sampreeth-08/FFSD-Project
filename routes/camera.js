const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const mongoose = require("mongoose")
const User = mongoose.model("User");
const Post = mongoose.model("Post");
const validator = require('validator')
const requireLogin = require('../middleware/requiredLogin');
const requiredLogin = require('../middleware/requiredLogin');

app.use(bodyParser.urlencoded({ extended: false }));

// router.get("/", (req, res) => {
//   console.log(req.session.user.username)
//   User.find({ _id: req.params.UserId }, function (err, post) {
//     //console.log(post)
//     res.render("camera", {
//      // title: req.session.user.username,
//       //username: req.session.user.username
//     });
//   });
// })

router.get('/allpost', (req, res) => {
  Post.find()
    .populate("postedBy", "_id username")
    .then(posts => {
      res.json({ posts })
    })
    .catch(err => {
      console.log(err);
    })
})


router.get('/mypost', requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("PostedBy", "_id name")
    .then(mypost => {
      res.json(mypost)
    })
    .catch(err => {
      console.log(err);
    })
})





router.get('/camera', (req, res)=>{
  res.render("camera")
})

router.post('/camera', (req, res) => {
  console.log(req.body);
  const { image, hashtags, caption } = req.body;
  if (!image || !hashtags || !caption) {
    return res.status(422).json({ error: "Please add all the fields" })
  }
  req.user.password = undefined
  const post = new Post({
    caption,
    hashtags,
    postedBy: req.user
  })
  Post.save()
    .then(result => {
      res.json({ Post: result })
    })
    .catch(err => {
      console.log(err);
    })
})












// router.post("/", (req, res) => {
//   const { image, caption, hashtags } = req.body;
//   const errors = [];

//   if (String(caption).length > 200 || String(hashtags).length > 200) {
//     errors.push({
//       param: 'username',
//       msg: 'Caption/hashtag is too long'
//     });
//   }

//   if (errors.length > 0) {
//     res.json({ errors });
//   }
//   else {
//     const newPost = new Post({
//       username: req.session.user.username,
//       caption: req.body.caption,
//       hashtags: req.body.hashtags,
//       likes: 0,
//       profile_image: req.session.user.profilePic,
//       image: String(req.body.image)
//     });

//     newPost.save(function (err) {
//       if (!err) {
//         res.render("camera", {
//           successMsg: "Post created successfully",
//           image: req.body.image
//         });
//         console.log("Post created successfully!!")
//       }
//       else {
//         res.render("camera", { errorMsg: "Caption/hashtag is too long" });
//         console.log("Error occurred!!")
//         console.log(err);
//       }
//     });
//   }







// });

module.exports = router