(function () {
    /**
     * Created by I323506 on 25/01/2017.
     */
    var app = angular.module('myApp');

    var HomeController = function ($scope, SocketService, $http) {

       $scope.title = "Home Page";

        $scope.admin = {
            email: 'test@mail.ru',
            password: "mypass777"
        }

        $scope.submit = function () {
            // SocketService.emit("register:admin", $scope.admin, function (confirmation) {
            //     console.log(confirmation)
            // })

            //this is the password to be used to encrypt the adminn data
            var myPassword = "valgros";

            //encrypt the email and passwod by using the pass above.
            var encryptedEmail = CryptoJS.AES.encrypt($scope.admin.email, myPassword);
            var encryptedPassword = CryptoJS.AES.encrypt($scope.admin.password, myPassword);

            //this object will be sent to server
           var encryptedObject = {
               email: encryptedEmail,
               password: encryptedPassword
           };

           //stringify the encypted data, we need CircularJSON as the encrypted data has references
            //to itself and cannot be sent via netwoks
            var CircularJSON = window.CircularJSON;

            //stringify the encruption
            var stringified = CircularJSON.stringify(encryptedObject);

            //send to server
            $http.post('login', stringified)


            // var decrypted = CryptoJS.AES.decrypt(encrypted, myPassword);

            // document.getElementById("demo0").innerHTML = myString;
            // document.getElementById("demo1").innerHTML = encrypted;
            // document.getElementById("demo2").innerHTML = decrypted;
            // document.getElementById("demo3").innerHTML = decrypted.toString(CryptoJS.enc.Utf8);
        }


    };

    app.controller('HomeCtrl', HomeController);

    app.directive("requestList", function (SocketService) {
        return {
            restrict: "E",
            templateUrl: "templates/requestList.html",
            controller: function ($scope) {
                //this is the socket.io will use for listening and emiting
                // var ss = SocketService.socket();
                var Button = function (carId, carName) {
                    this.text= "Accept the request";
                    this.textWhenAccepted= "Request accepted",
                        this.carId = carId;
                    this.carName = carName;
                    this.accepted = false;
                    this.socketId = null;
                    this.disabled = false;
                };

                $scope.assistanceRequests = [
                    new Button("311", "BMW i3"),
                    new Button("312", "Mercedes' AMG"),
                    new Button("313", "VW Beetle"),
                    new Button("314", "VW Scirocco")
                ];

                $scope.acceptRequest = function (req, index) {
                    req.accepted = true;
                    SocketService.emit("notify:accepted", req.socketId);

                    for (var i = 0; i < $scope.assistanceRequests.length; i++) {
                        if(i !== index) {
                            $scope.assistanceRequests[i].disabled = true;
                            break;
                        }
                    }
                };

                //staf cancel request
                $scope.cancelRequest = function (req, index) {
                    req.accepted = false;
                    SocketService.emit("notify:canceled", req.socketId)
                    for (var i = 0; i < $scope.assistanceRequests.length; i++) {
                        if(i !== index) {
                            $scope.assistanceRequests[i].disabled = false;
                        }
                    }
                };


                $scope.finishRequest = function (req) {
                    for (var i = 0; i < $scope.assistanceRequests.length; i++) {
                        if($scope.assistanceRequests[i].carId === req.carId) {
                            $scope.assistanceRequests.splice(i, 1)
                        }
                    }
                    SocketService.emit("notify:done", req.socketId)

                };

                $scope.arrivedAtPlace = function (req) {
                    SocketService.emit("notifyOf:arrival", req.socketId)
                };

                //listen for request, and add it to the list
                SocketService.on("request", function (data) {
                    console.log("request some assistance");
                    var request = new Button(data.carId, data.carName);
                    request.socketId = data.socketId;
                    $scope.assistanceRequests.push(request)
                })

                //when client canceed assistance request
                SocketService.on("client:send:cancel", function (data) {
                    for (var i = 0; i < $scope.assistanceRequests.length; i++) {
                        console.log("_++++");
                        if($scope.assistanceRequests[i].socketId === data) {
                            console.log("we found it at index: " + i);
                            $scope.assistanceRequests.splice(i, 1)
                        }
                        else {
                            $scope.assistanceRequests[i].disabled = false;
                        }
                    }
                });

                SocketService.on("client:met", function (data) {
                    for (var i = 0; i < $scope.assistanceRequests.length; i++) {
                        if($scope.assistanceRequests[i].socketId === data) {
                            $scope.assistanceRequests.splice(i, 1)
                        }
                        else {
                            $scope.assistanceRequests[i].disabled = false;
                        }
                    }
                })
            }
        }
    })
}());
