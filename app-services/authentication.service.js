(function() {
  'use strict';

  angular
    .module('ShopDBAdmin')
    .factory('AuthenticationService', Service);

  function Service($http, $localStorage, $location, jwtHelper, apiurl) {
    var service = {};


    service.Login = Login;
    service.Logout = Logout;
    service.Status = Status;

    return service;

    function Login(email, password, callback) {
      $http.post(apiurl + "/login", {
          email: email,
          password: password
        })
        .then(function(response) {
            if (response.data.result) {
              $localStorage.token = response.data.token;
              $localStorage.admin = response.data.admin;
              callback(true);
            } else {
              callback(false);
            }
          },
          function(data) {
            callback(false);
          });
    }

    function Status(callback) {
      $http.get(apiurl + "/status", {})
        .then(function(response) {
            if (response.data.result) {
              callback(true);
            } else {
              callback(false);
            }
          },
          function(data) {
            callback(false);
          });
    }

    function Logout() {
      delete $localStorage.token;
      $location.path('/login');
    }
  }
})();
