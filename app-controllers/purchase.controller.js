(function() {
  'use strict';

  angular
    .module('ShopDBAdmin')
    .controller('PurchaseController', ['$scope', '$localStorage', '$q',
      'getDataService', '$filter', Controller
    ]);

  function Controller($scope, $localStorage, $q, getDataService, $filter) {
    var vm = this;
    vm.loading = true;

    // Pagination variables
    vm.viewby = 10;
    vm.currentPage = 1;
    vm.purchasesPerPage = vm.viewby;
    vm.maxSize = 6;
    vm.purchasesPerPageSelect = [10, 20, 30, 50, 100, 200, 500];
    vm.paginationWindow = [];

    // Pagination functions
    vm.setPage = function(pageNo) {
      vm.currentPage = pageNo;
      var start = (pageNo - 1) * vm.purchasesPerPage;
      var end = pageNo * vm.purchasesPerPage;
      vm.paginationWindow = vm.revpurchases.slice(start, end);
    };

    vm.setItemsPerPage = function(num) {
      vm.purchasesPerPage = num;
      vm.currentPage = 1;
    }
    initController().then(handleData)

    function handleData() {
      for (var purchase of vm.purchases) {
        purchase.consumerName = vm.consumers.find(x => x.id === purchase.consumer_id).name;
        purchase.productName = vm.products.find(x => x.id === purchase.product_id).name;
      }
      // Pagination

      vm.totalPurchases = vm.purchases.length;
      vm.setPage(1);
      vm.loading = false;
    }

    function initController() {
      vm.admin = $localStorage.admin;

      return $q.all([
        getDataService.getData('consumers').then(function(consumers) {
          vm.consumers = consumers[0];
        }),
        getDataService.getData('purchases').then(function(purchases) {
          vm.purchases = purchases[0];
          vm.revpurchases = vm.purchases.reverse();
        }),
        getDataService.getData('products').then(function(products) {
          vm.products = products[0];
        })
      ])
    }
  }

})();
