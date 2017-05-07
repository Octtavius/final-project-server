(function () {
    /**
     * Created by I323506 on 25/01/2017.
     */
    var app = angular.module('myApp');

    var HomeController = function ($scope, SocketService) {

       $scope.title = "Home Pahe";

       var Button = function (carId, carName) {
           this.text= "Accept the request";
           this.textWhenAccepted= "Request accepted",
           this.carId = carId;
           this.carName = carName;
           this.accepted = false;
       }

       $scope.assistanceRequests = [
           new Button("111", "BMW i3"),
           new Button("112", "Mercedes AMG"),
           new Button("113", "VW Beetle"),
           new Button("114", "VW Scirocco")
       ];

       $scope.acceptRequest = function (req) {
           req.accepted = true
       }

       $scope.cancelRequest = function (req) {
           req.accepted = false;
       }
    };

    app.controller('HomeCtrl', HomeController);
}());
