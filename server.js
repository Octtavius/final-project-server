var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var bodyParser = require('body-parser');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');


var port = process.env.PORT || 3000;

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');

var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

// //++++++++++++++++++++++++++++++++++++++++++++++++++
// //++++++++++++++++++++++++++++++++++++++++++++++++++
// //++++++++++++++++++++++++++++++++++++++++++++++++++
// //++++++++++++++++++++++++++++++++++++++++++++++++++
//
//
// var request = require('request')
//
//
//
// var url = 'https://couchdb-77cd9f.smileupps.com/'
// var db = 'alice'
// var id = 'document_id';
//
// // request(url + db + id, function(err, res, body) {
// //
// //       var ob = JSON.parse(body)
// //       console.log(ob.user + ' : ' + ob.message)
// //     });
//
// var db = require('./database/db');
//
// var data = {
//     _id: (new Date().toJSON()) + ':myid',
//     message: "My messaged"
// }
//
// db.save('alice', data, function(err, doc) {
//     console.log("saved to couch dv");
// })
//
// // // // Create a database/collection inside CouchDB
// // // request.put(url + db, function(err, resp, body) {
// // //   // Add a document with an ID
// // //   request.put({
// // //     url: url + db + id,
// // //     body: {"message":'New Shiny Document', "user": 'stefan'},
// // //     json: true,
// // //   }, function(err, resp, body) {
// // //     // Read the document
// // //     request(url + db + id, function(err, res, body) {
// // //       console.log(body.user + ' : ' + body.message)
// // //     })
// // //   })
// // // })
//
// //++++++++++++++++++++++++++++++++++++++++++++++++++
// //++++++++++++++++++++++++++++++++++++++++++++++++++
// //++++++++++++++++++++++++++++++++++++++++++++++++++
// //++++++++++++++++++++++++++++++++++++++++++++++++++

var Routes =  require('./routes/routes-index');
var users = require('./routes/users');

app.use(express.static('public'));

app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(path.join(__dirname, 'www')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: 'shhsecret',
    proxy: true,
    resave: true,
    saveUninitialized: true
     }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use('/', Routes);
// app.use('/users', users);

require('./config/passport')(passport);

var userSockets = {};

io.on('connection', function(socket){
    console.log('a user connected: ' + socket.id);

    socket.on("notify:accepted", function (clientId) {
        io.to(clientId).emit("staff:accepted:request")
    });

    socket.on("met:assistant", function () {
        console.log("met assistant");
        io.emit("client:met", socket.id)
    });

    socket.on("notify:canceled", function (clientId) {
        console.log("notify client that staff canceld the rquests");
        io.to(clientId).emit("staff:canceled:request")
    });

    socket.on("notify:done", function (clientId) {
        io.to(clientId).emit("staff:reply")
    });

    socket.on('client:cancel:request', function () {
        console.log("client canceled request: ")
        io.emit("client:send:cancel", socket.id);
    });
    socket.on('send:request', function(data){
        data.socketId = socket.id;
        io.emit('request', data);
    });

    socket.on('notifyOf:arrival', function(clientId){
        io.to(clientId).emit("staff:arrived")
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });


http.listen(port, function(){
    console.log('listening on *:' + port);
});