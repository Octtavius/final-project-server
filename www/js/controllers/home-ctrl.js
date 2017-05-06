(function () {
    /**
     * Created by I323506 on 25/01/2017.
     */
    var app = angular.module('myApp');

    var HomeController = function ($scope) {

       $scope.title = "Home Pahe"
    };

    app.controller('HomeCtrl', HomeController);
}());
