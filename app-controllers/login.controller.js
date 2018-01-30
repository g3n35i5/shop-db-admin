(function() {
  'use strict';

  angular
    .module('ShopDBAdmin')
    .controller('LoginController', Controller);

  function Controller($location, AuthenticationService) {
    var vm = this;

    vm.login = login;

    initController();

    function initController() {
      // reset login status
      AuthenticationService.Logout();
    };

    function login() {
      vm.loading = true;
      AuthenticationService.Login(vm.email, vm.password).then(function() {
        $location.path('/dashboard')
      }).catch(function() {
        vm.error = 'Email or password is incorrect';
        vm.loading = false;
      });
    };
  }

})();
