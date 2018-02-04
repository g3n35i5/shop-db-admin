(function() {
  'use strict';

  angular
    .module('ShopDBAdmin')
    .controller('DepositController', ['$scope', '$localStorage', '$q',
      'getDataService', '$filter', Controller
    ]);

  function Controller($scope, $localStorage, $q, getDataService, $filter) {
    var vm = this;
    vm.loading = true;

    // Pagination variables
    vm.viewby = 10;
    vm.currentPage = 1;
    vm.depositsPerPage = vm.viewby;
    vm.maxSize = 6;
    vm.depositsPerPageSelect = [10, 20, 30, 50, 100, 200, 500];
    vm.paginationWindow = [];

    // Pagination functions
    vm.setPage = function(pageNo) {
      vm.currentPage = pageNo;
      var start = (pageNo - 1) * vm.depositsPerPage;
      var end = pageNo * vm.depositsPerPage;
      vm.paginationWindow = vm.revdeposits.slice(start, end);
    };

    vm.setItemsPerPage = function(num) {
      vm.depositsPerPage = num;
      vm.currentPage = 1;
      vm.setPage(1);
    }
    initController().then(handleData)

    function handleData() {
      for (var deposit of vm.deposits) {
        deposit.consumerName = vm.consumers.find(x => x.id === deposit.consumer_id).name;
      }

      // Pagination
      vm.totalDeposits = vm.deposits.length;
      vm.setPage(1);
      vm.loading = false;
    }

    function initController() {
      vm.admin = $localStorage.admin;

      return $q.all([
        getDataService.getData('consumers').then(function(consumers) {
          vm.consumers = consumers[0];
        }),
        getDataService.getData('deposits').then(function(deposits) {
          vm.deposits = deposits[0];
          vm.revdeposits = vm.deposits.reverse();
        })
      ])
    }
  }

})();
