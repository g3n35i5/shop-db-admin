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
    initController().then(handleData)

    function handleData() {
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
        }),
        getDataService.getData('products').then(function(products) {
          vm.products = products[0];
        })
      ])
    }
  }

})();
