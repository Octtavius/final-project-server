var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var port = process.env.PORT || 3000;


app.use(express.static('public'));

app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(path.join(__dirname, 'www')));

var Routes =  require('./routes/routes-index');
app.use('/', Routes);

var userSockets = {};

io.on('connection', function(socket){
    console.log('a user connected: ' + socket.id);
    // //register client
    // if ( userSockets[socket.id] == null) {
    //     userSockets[socket.id] = socket.id;
    // }

    socket.on("register:admin", function (data, fn) {
        var admin = data.admin_id
        console.log(admin);
        fn(true)
    });

    socket.on("notify:accepted", function (clientId) {
        io.to(clientId).emit("staff:accepted:request")
    });

    socket.on("notify:canceled", function (data) {
        console.log(data);
        console.log(typeof data);
    })

    socket.on("notify:done", function (data) {
        io.emit("staff:reply", true);
        console.log(data);
        console.log(typeof data);
    });

    socket.on('client:cancel:request', function () {
        console.log("client canceled request: ")
        io.emit("client:send:cancel", socket.id);
    })

    socket.on('send:request', function(data){
        // var request = data.car;
        console.log("arrived request from car===::::: " + data);
        data.socketId = socket.id;
        console.log(socket.id);
        io.emit('request', data)
    });

    socket.on('notifyOf:arrival', function(clientId){
        console.log(clientId);
        io.to(clientId).emit("staff:arrived")
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

http.listen(port, function(){
    console.log('listening on *:' + port);
});