var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var flash = require("connect-flash");
var path = require("path");

var User = require("./models/users"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

var feedRoute = require("./routes/feed"),
    commentRoute = require("./routes/comments"),
    authRoute = require("./routes/index");
  
const app = express();

mongoose.connect("mongodb+srv://celestial:celestial@celestialcluster.zrcyq.mongodb.net/CelestialDB?retryWrites=true&w=majority")
  .then(() => {
    console.log("Database connection successful")
  })
  .catch((err) => {
    console.log("Database connection error" + err)
  })

app.set("view engine", "ejs");
app.use(flash());


app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));

app.use(require("express-session")({
  secret: "Wake up to reality",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000
  }
}));

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(feedRoute);
//app.use(commentRoute);
app.use(authRoute);

app.listen(3000, function(){
  console.log("Celestial server is running..");
});