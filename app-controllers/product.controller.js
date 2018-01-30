(function() {
  'use strict';

  angular
    .module('ShopDBAdmin')
    .controller('ProductController', ['$scope', '$localStorage', '$q',
      'getDataService', 'postDataService', 'putDataService', '$filter', Controller
    ]);

  function Controller($scope, $localStorage, $q, getDataService, postDataService, putDataService, $filter) {
    var vm = this;
    vm.loading = true;

    vm.editProductDataInitial = {
      'product': null,
      'editedProduct': null,
      'error': false,
      'errorMessage': null
    }

    vm.editProductData = angular.copy(vm.editProductDataInitial);

    // product list filters
    vm.sortType = 'name';
    vm.sortReverse = false;
    vm.searchString = '';

    initController().then(handleData)

    function handleData() {
      for (var product of vm.products) {
        product.departmentName = vm.departments.find(x => x.id === product.department_id).name;
      }
      vm.loading = false;
    }

    vm.editProduct = function() {
      if (vm.editProductData.product != vm.editProductData.editedProduct) {
        var data = {
          'id': vm.editProductData.editedProduct.id,
          'name': vm.editProductData.editedProduct.name,
          'department_id': vm.editProductData.editedProduct.department_id,
          'price': vm.editProductData.editedProduct.price
        }

        putDataService.putData('/product/' + data.id, data).then(function(res) {
          if (res['result'] == 'updated') {
            getDataService.getData('products').then(function(products) {
              vm.products = products[0];
            })
            $('#editProductModal').modal('toggle');
            vm.editProductData = angular.copy(vm.editProductDataInitial);
          } else {
            vm.editProductData.error = true;
            vm.editProductData.errorMessage = 'Something went wrong!'
          }
        })
      }
    }

    vm.openEditProductModal = function(product) {
      vm.editProductData.product = angular.copy(product);
      vm.editProductData.editedProduct = angular.copy(product);
      $('#editProductModal').modal('toggle')
    }

    function initController() {
      vm.admin = $localStorage.admin;
      return $q.all([
        getDataService.getData('products').then(function(products) {
          vm.products = products[0];
        }),
        getDataService.getData('departments').then(function(departments) {
          vm.departments = departments[0];
        })
      ])
    }
  }
})();
