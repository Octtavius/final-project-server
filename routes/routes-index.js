var express = require('express'),
    router = express.Router(),
    passport = require('passport');
    crypto = require('crypto-js')

router.get('/', function (req, res) {
    res.sendFile('/www/index.html')
});

// router.route('/login')
//     .post(function (req, res) {
//         var myPassword = "valgros";
//
//         var staff =
//             {
//                 decryptedEmail: crypto.AES.decrypt(req.body.email, myPassword).toString(crypto.enc.Utf8),
//                 decryptedPassword: crypto.AES.decrypt(req.body.password, myPassword).toString(crypto.enc.Utf8)
//             };
//         console.log(staff);
//     });
// loggedin
router.get("/loggedin", function(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/profile', isLoggedIn, function(req, res) {
    res.json({user:req.user})
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
    {
        console.log("hehhh");
        return next();
    }
    res.redirect('/');
}