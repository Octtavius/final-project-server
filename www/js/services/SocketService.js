(function(){

  angular.module('myApp')
      .service('SocketService', ['socketFactory', SocketService]);

    function SocketService(socketFactory){
        return socketFactory({

            ioSocket: io.connect('http://localhost:3000')

        });
    }
})();