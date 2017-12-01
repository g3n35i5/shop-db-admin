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
      for (var purchase of vm.purchases) {
        purchase.consumerName = vm.consumers.find(x => x.id === purchase.consumer_id).name;
        purchase.productName = vm.products.find(x => x.id === purchase.product_id).name;
      }
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
