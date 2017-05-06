(function () {
    var app = angular.module("myApp", ["ngRoute"]);

    app.config(function ($routeProvider) {
        $routeProvider
            .when("/home", {
                templateUrl: "templates/home.html",
                controller: "HomeCtrl"
            })
            // .when("/user/:username", {
            //     templateUrl: "partials/user.html",
            //     controller: "UserCtrl"
            // })
            // .when("/repo/:username/:reponame", {
            //     templateUrl: "partials/repo.html",
            //     controller: "RepoCtrl"
            // })
            .otherwise({redirectTo: "/home"});
    });
}());