(function() {
  'use strict';

  angular
    .module('ShopDBAdmin')
    .controller('NavbarController', Controller);

  function Controller($location, AuthenticationService) {
    var vm = this;


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
