(function() {
  'use strict';

  angular
    .module('ShopDBAdmin')
    .controller('NavbarController', Controller);

  function Controller($scope, $location, $localStorage, AuthenticationService) {
    var vm = this;
    var token = $localStorage.token;

    AuthenticationService.Subscribe($scope, (state) => vm.loggedIn = state);

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
        },
        {
          title: 'Deposits',
          route: 'deposits'
        }
      ];

      vm.go = function(route) {
        $location.path('/' + route);
      };
    };
  }

})();
