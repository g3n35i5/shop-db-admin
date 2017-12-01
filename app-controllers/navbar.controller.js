(function() {
  'use strict';

  angular
    .module('ShopDBAdmin')
    .controller('NavbarController', Controller);

  function Controller($location, $localStorage, AuthenticationService) {
    var vm = this;
    var token = $localStorage.token;
    vm.loggedIn = null;
    if (typeof(token) === "undefined" || !token) {
      vm.loggedIn = false;
    } else {
      vm.loggedIn = true;
    }

    initController();

    function initController() {
      vm.tabs = [
        {
          title: 'Dashboard',
          route: 'dashboard'
        },
        {
          title: 'Consumers',
          route: 'consumers'
        },
        {
          title: 'Departments',
          route: 'departments'
        },
        {
          title: 'Products',
          route: 'products'
        },
        {
          title: 'Purchases',
          route: 'purchases'
        }
      ];

      vm.go = function(route) {
        $location.path('/' + route);
      };
    };
  }

})();
