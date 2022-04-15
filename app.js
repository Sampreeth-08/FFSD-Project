require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const saltrounds = 10;
const { body, validationResult } = require('express-validator');
const validator = require('validator');
const cookieParser = require('cookie-parser');
const server = require('http').createServer();
const users = {};
const cors = require('cors')
const ejs = require('ejs');
const session = require('express-session');
//const requiredLogin = require("./middleware/requiredLogin");



const app = express();

const PASSWORD = process.env.PASSWORD.toString();
mongoose.connect("mongodb+srv://celestial:celestial@celestialcluster.zrcyq.mongodb.net/CelestialDB?retryWrites=true&w=majority")
  .then(() => {
    console.log("Database connection successful")
  })
  .catch((err) => {
    console.log("Database connection error" + err)
  })


require('./models/User')
require('./models/Post')

app.set('view engine', 'ejs');
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(require('./router'))
// app.use(cors({
//   origin: false
// }))
// app.use(session({
//   secret:"Confidential",
//   cookie: {maxAge: 900000},
//   resave: true,
//   saveUninitialized: false
// }))

const req = require('express/lib/request');
app.use(require('./routes/loginRoutes'));
app.use(require('./routes/signupRoutes'))
app.use(require('./routes/camera'))
app.use("/logout", require('./routes/logout'))

// app.use("/profile", requiredLogin, require('./routes/profile'))
// app.use("/camera", requiredLogin, require('./routes/camera'))
// app.use("/discover",requiredLogin,require('./routes/discover'))
// app.use("/single_post",requiredLogin,require('./routes/single_post'))
// app.use("/edit_profile", requiredLogin, require('./routes/edit_profile'))
// app.use("/liked_posts",requiredLogin,require('./routes/liked_posts'))
// app.use("/profile",requiredLogin,require('./routes/profile'))
// app.use("/search",requiredLogin,require('./routes/search'))
// app.use("/index",requiredLogin,require('./routes/index'))
// app.use("/user_profile",requiredLogin,require('./routes/user_profile'))


app.listen(3000, () => {
  console.log("Server started on port 3000")
})