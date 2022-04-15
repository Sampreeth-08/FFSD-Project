// module.exports = (req, res, next) => {
//     if (req.session && req.session.user) {
//         return next();
//     }
//     else {
//         return res.redirect('/');
//     }
// }

const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../keys')
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = (req, res, next) => {
    if (!authorization) {
        return res.status(401).json({ error: "You must be logged in" })
    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "You must be logged in" })
        }
        const { _id } = payload
        User.findById(_id).then(userdata => {
            req.user = userdata
            next()
        })
    })
}