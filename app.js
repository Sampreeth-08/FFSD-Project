const express = require('express');
const app = express();
const port = 3000;
const middleware = require('./middleware');
const path = require('path');
const bodyParser = require("body-parser");


const server = app.listen(port, () => console.log("Server listening on port " + port));

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, "public/assets/css")))
app.use('/js', express.static(path.join(__dirname, "public/assets/js")))
app.use('/img', express.static(path.join(__dirname, "public/assets/img")))

//app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

//Routes
const loginRoute = require('./routes/loginRoutes');
const signupRoute = require('./routes/signupRoutes');

app.use("/login", loginRoute);
app.use("/signup", signupRoute)

app.get("/", middleware.requireLogin, (req, res, next) => {
    var payload={
        pageTitle: "Home",
        userLoggedIn: req.session.user
    }
    res.status(200).render("index", payload);

    //res.status(200).render(path.join(__dirname + "/views/index"));
})