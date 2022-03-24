const express = require('express');
const app = express();
const router = express.Router();
const path = require('path')
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {
    res.status(200).render("login")
    //res.status(200).render(path.join(__dirname, "./../views/login"))
})
module.exports = router;