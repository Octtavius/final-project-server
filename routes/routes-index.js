var express = require('express'),
    router = express.Router();
    router.get('/', function (req, res) {
    res.sendFile('/www/index.html')
});
//
// router.route('/login')
//     .get(function (req, res) {
//         res.sendFile('/login.html');
//     });
//
// router.post('/newuser', function (req, res) {
//     return userCtrl.create(req, res);
// });

module.exports = router;