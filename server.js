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

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on("register:admin", function (data) {
        var admin = data.username
        console.log(admin);
    })

    socket.on('send:request', function(data){
        var request = data.car;
        console.log("arrived request from car===::::: " + request);
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

http.listen(port, function(){
    console.log('listening on *:' + port);
});