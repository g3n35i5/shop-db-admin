(function() {
  'use strict';

  angular
    .module('ShopDBAdmin')
    .controller('ProductController',
      [
        '$scope',
        '$localStorage',
        '$q',
        'toastr',
        'apiurl',
        'getDataService',
        'postDataService',
        'putDataService',
        '$filter',
        Controller
    ]);

  function Controller(
      $scope,
      $localStorage,
      $q,
      toastr,
      apiurl,
      getDataService,
      postDataService,
      putDataService,
      $filter
    ) {
    var vm = this;
    vm.loading = true;

    vm.editProductDataInitial = {
      'product': null,
      'editedProduct': null,
      'error': false,
      'errorMessage': null
    }

    vm.editProductData = angular.copy(vm.editProductDataInitial);

    vm.addProductDataInitial = {
      'name': null,
      'price': null,
      'department_id': null,
      'countable': null,
      'revocable': null
    }

    // product list filters
    vm.sortType = 'name';
    vm.sortReverse = false;
    vm.searchString = '';

    function extend_products() {
      for (var product of vm.products) {
        product.departmentName = vm.departments.find(x => x.id === product.department_id).name;
        if (product.image) {
          product.image = apiurl + '/images/' + product.image;
        } else {
          product.image = apiurl + '/images/default.jpg';
        }
      }
    }
    initController().then(handleData)

    function handleData() {
      extend_products()
      vm.loading = false;
    }

    vm.addProduct = function () {
      var data = vm.addProductData;
      var valid = true;
      for (var key in data) {
        if (data[key] === null || data[key] === 'undefined') {
          toastr.error(key + ' is not defined!', 'Product');
          valid = false;
        }
      }
      if (valid) {
        postDataService.postData('/products', data).then(function(res) {
          if (res['result'] === 'created') {
            getDataService.getData('products').then(function(products) {
              vm.products = products[0];
            })
            toastr.success(data.name + ' added', 'Product');
            extend_products()
            $('#addProductModal').modal('toggle');
            vm.addProductData = angular.copy(vm.addProductDataInitial);
          } else {
            toastr.error('Could not insert product', 'Product');
          }
        })
      }
    }
    vm.editProduct = function() {
      if (vm.editProductData.product != vm.editProductData.editedProduct) {
        var data = {
          'id': vm.editProductData.editedProduct.id,
          'name': vm.editProductData.editedProduct.name,
          'department_id': vm.editProductData.editedProduct.department_id,
          'price': vm.editProductData.editedProduct.price,
          'image': vm.editProductData.editedProduct.image
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

    vm.openAddProductModal = function() {
      vm.addProductData = angular.copy(vm.addProductDataInitial);
      $('#addProductModal').modal('toggle')
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
