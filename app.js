// const express = require('express');
// const app = express();
// const port = 3000;
// const middleware = require('./middleware');
// const path = require('path');
// const bodyParser = require("body-parser");
// const mongoose=require('./database');
// const session=require('express-session');


// const server = app.listen(port, () => console.log("Server listening on port " + port));

// app.set("view engine", "ejs");
// app.set("views", "views");

// app.use(express.static('public'));
// app.use('/css', express.static(path.join(__dirname, "public//css")))
// app.use('/js', express.static(path.join(__dirname, "public//js")))
// app.use('/img', express.static(path.join(__dirname, "public//img")))

// //app.use(express.static(path.join(__dirname, "public")));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(session({
//     secret: "confidential info",
//     resave: true,
//     saveUninitialized: false
// }))


// //Routes
// const loginRoute = require('./routes/loginRoutes');
// const signupRoute = require('./routes/signupRoutes');
// const logoutRoute = require('./routes/logout');

// app.use("/login", loginRoute);
// app.use("/signup", signupRoute);
// app.use("/logout", logoutRoute);

// app.get("/", middleware.requireLogin, (req, res, next) => {
//     var payload={
//         pageTitle: "Home",
//         userLoggedIn: req.session.user
//     }
//     res.status(200).render("index", payload);

//     //res.status(200).render(path.join(__dirname + "/views/index"));
// })









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
const requiredLogin = require("./middleware/requiredLogin");



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

app.set('view engine', 'ejs');
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(require('./router'))
app.use(cors({
  origin: false
}))
app.use(session({
  secret: "Tatakae",
  resave: true,
  saveUninitialized: false
}))

const req = require('express/lib/request');
app.use(require('./routes/loginRoutes'));
app.use(require('./routes/signupRoutes'))
app.use("/logout", require('./routes/logout'))
app.use("/profile", requiredLogin, require('./routes/profile'))
// app.use("/camera",requiredLogin,require('./routes/camera'))
// app.use("/discover",requiredLogin,require('./routes/discover'))
// app.use("/single_post",requiredLogin,require('./routes/single_post'))
app.use("/edit_profile", requiredLogin, require('./routes/edit_profile'))
// app.use("/liked_posts",requiredLogin,require('./routes/liked_posts'))
// app.use("/profile",requiredLogin,require('./routes/profile'))
// app.use("/search",requiredLogin,require('./routes/search'))



app.listen(3000, () => {
  console.log("Server started on port 3000")
})