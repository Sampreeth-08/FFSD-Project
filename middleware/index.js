var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
    console.log(req.session.user)
    req.session = req.session;
    if (req.session && req.session.user) {
        console.log("Reached here")
        return next();
    }
    else {
        console.log("reached in else clause")
        return res.redirect('/login');
        // return res.redirect('profile')
    }
};

module.exports = middlewareObj;