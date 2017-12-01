(function() {
  'use strict';

  angular
    .module('ShopDBAdmin', ['ui.router', 'ngStorage', 'angular-jwt', 'chart.js'])
    .config(config)
    .run(run)
    .constant("apiurl", "http://" + window.location.hostname + ":5000");

  function config($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'app-pages/partial.dashboard.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      })
      .state('consumers', {
        url: '/consumers',
        templateUrl: 'app-pages/partial.consumers.html',
        controller: 'ConsumerController',
        controllerAs: 'vm'
      })
      .state('departments', {
        url: '/departments',
        templateUrl: 'app-pages/partial.departments.html',
        controller: 'DepartmentController',
        controllerAs: 'vm'
      })
      .state('products', {
        url: '/products',
        templateUrl: 'app-pages/partial.products.html',
        controller: 'ProductController',
        controllerAs: 'vm'
      })
      .state('purchases', {
        url: '/purchases',
        templateUrl: 'app-pages/partial.purchases.html',
        controller: 'PurchaseController',
        controllerAs: 'vm'
      })
      .state('stockhistory', {
        url: '/stockhistory',
        templateUrl: 'app-pages/partial.stockhistory.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'app-pages/login.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      })
      .state('offline', {
        url: '/offline',
        templateUrl: 'app-pages/offline.html'
      });
  }

  function run($rootScope, $http, $location, $localStorage, jwtHelper, AuthenticationService) {
    $rootScope.$on('$locationChangeStart', function(event, next, current) {
      AuthenticationService.Status(function(result) {
        if (!result) {
          $location.path('/offline');
        } else {
          if ($location.path() !== '/login') {
            try {
              var token = $localStorage.token;
              var tokenExpired = jwtHelper.isTokenExpired(token);
              if (tokenExpired) {
                $location.path('/login');
              }
            } catch (e) {
              $location.path('/login');
            }
          }
          var publicPages = ['/login'];
          var restrictedPage = publicPages.indexOf($location.path()) === -1;
          if (restrictedPage && !$localStorage.token) {
            $location.path('/login');
          }
        }
      });

    });
  }
})();
