(function(){

  angular.module('myApp')
    .service('SocketService', ['socketFactory', SocketService]);

  function SocketService(socketFactory){
    var ioSocket = null;
    var connect = function () {
      ioSocket = io.connect('http://localhost:3000')
    };
    var emit = function (event, msg) {
      ioSocket.emit(event, msg)
    }
    // return socketFactory({ioSocket: io.connect('http://localhost:3000')});
    return {
      connect: connect,
      emit: emit
    }
  }
})();
