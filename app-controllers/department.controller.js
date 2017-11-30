(function() {
  'use strict';

  angular
    .module('ShopDBAdmin')
    .controller('DepartmentController', ['$scope', '$localStorage', '$q',
      'getDataService', '$filter', Controller
    ]);

  function Controller($scope, $localStorage, $q, getDataService, $filter) {
    var vm = this;
    initController().then(handleData)

    function handleData() {


    }

    function initController() {
      vm.admin = $localStorage.admin;
      return $q.all([
        getDataService.getData('departments').then(function(departments) {
          vm.departments = departments[0];
        }),
        getDataService.getData('payoffs').then(function(payoffs) {
          vm.payoffs = payoffs[0];
        })
      ])
    }
  }

})();
