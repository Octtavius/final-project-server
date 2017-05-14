var express = require('express'),
    router = express.Router(),
    crypto = require('crypto-js')

router.get('/', function (req, res) {
    res.sendFile('/www/index.html')
});
//
// router.route('/login')
//     .get(function (req, res) {
//         res.json({"data": 'textz'});
//     });

router.route('/login')
    .post(function (req, res) {
        var myPassword = "valgros";

        var staff =
            {
                decryptedEmail: crypto.AES.decrypt(req.body.email, myPassword).toString(crypto.enc.Utf8),
                decryptedPassword: crypto.AES.decrypt(req.body.password, myPassword).toString(crypto.enc.Utf8)
            };

    })

// router.post('/newuser', function (req, res) {
//     return userCtrl.create(req, res);
// });

module.exports = router;