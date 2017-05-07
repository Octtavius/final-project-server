(function () {
    /**
     * Created by I323506 on 25/01/2017.
     */
    var app = angular.module('myApp');

    var HomeController = function ($scope, SocketService) {

       $scope.title = "Home Pahe";

        $scope.admin = {}

        $scope.submit = function () {
            SocketService.emit("register:admin", $scope.admin, function (confirmation) {
                console.log(confirmation)
            })
        }

       //this is the socket.io will use for listening and emiting
       // var ss = SocketService.socket();
       var Button = function (carId, carName) {
           this.text= "Accept the request";
           this.textWhenAccepted= "Request accepted",
           this.carId = carId;
           this.carName = carName;
           this.accepted = false;
       };

       $scope.assistanceRequests = [
           new Button("111", "BMW i3"),
           new Button("112", "Mercedes' AMG"),
           new Button("113", "VW Beetle"),
           new Button("114", "VW Scirocco"),
           new Button("114", "VW Scirocco")
       ];

       $scope.acceptRequest = function (req) {
           req.accepted = true;
           SocketService.emit("notify:accepted", true)
       };

       $scope.cancelRequest = function (req) {
           req.accepted = false;
           SocketService.emit("notify:canceled", true)
       };


       $scope.finishRequest = function (req) {
           for (var i = 0; i < $scope.assistanceRequests.length; i++) {
               if($scope.assistanceRequests[i].carId === req.carId) {
                    $scope.assistanceRequests.splice(i, 1)
               }
           }
           SocketService.emit("notify:done", true)

       };

       //listen for request, and add it to the list
       SocketService.on("request", function (data) {
           var request = new Button(data.carId, data.carName);
           $scope.assistanceRequests.push(request)
       })
    };

    app.controller('HomeCtrl', HomeController);
}());
