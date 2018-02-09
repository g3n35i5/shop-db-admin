(function() {
  'use strict';

  angular
    .module('ShopDBAdmin')
    .controller('DepartmentController', [
        '$scope',
        '$localStorage',
        '$q',
        'toastr',
        'getDataService',
        'postDataService',
        'putDataService',
        '$filter',
        Controller
    ]);

  function Controller($scope, $localStorage, $q, toastr, getDataService, postDataService, putDataService,  $filter) {
    var vm = this;
    initController().then(handleData)

    vm.dpurchaseDataInitial = {
      department: null,
      dpurchases: []
    }
    vm.dpurchaseInitial = {
      product: null,
      productname: null,
      amount: null,
      price: null
    }

    vm.payoffDataInitial = {
      department: null,
      amount: null,
      comment: null
    }

    vm.dpurchaseData = angular.copy(vm.dpurchaseDataInitial);
    vm.dpurchase = angular.copy(vm.dpurchaseInitial);
    vm.payoffData = angular.copy(vm.payoffDataInitial);

    function extend_payoffs() {
      for (var payoff of vm.payoffs) {
        payoff.departmentName = vm.departments.find(x => x.id === payoff.department_id).name;
      }
    }

    function handleData() {
      extend_payoffs()
    }

    vm.add_dpurchase = function() {
      if (vm.dpurchase.product && vm.dpurchase.amount && vm.dpurchase.price) {
        vm.dpurchase.productname = vm.dpurchase.product.name;
        vm.dpurchaseData.dpurchases.push(vm.dpurchase);
        vm.dpurchase = angular.copy(vm.dpurchaseInitial);
      } else {
        toastr.error('Form is invalid', 'Department purchase');
      }
    }

    vm.remove_dpurchase = function (item) {
      var array = vm.dpurchaseData.dpurchases;
      array.splice(array.indexOf(item), 1);
    }

    vm.openDepartmentpurchaseModal = function(department) {
      vm.dpurchaseData.department = department;
      $('#departmentpurchaseModal').modal('toggle')
    }

    vm.openPayoffModal = function(department) {
      vm.payoffData.department = department;
      $('#payoffModal').modal('toggle')
    }

    vm.insert_payoff = function () {
      var obj = vm.payoffData;
      if (obj.amount && obj.department && obj.comment) {
        var data = {
          department_id: obj.department.id,
          amount: obj.amount,
          comment: obj.comment
        }
        postDataService.postData('/payoff', data).then(function(res) {
          if (res['result'] === 'created') {
            toastr.success('Deposit inserted', 'Deposit')
            getDataService.getData('payoffs').then(function(payoffs) {
              vm.payoffs = payoffs[0];
              extend_payoffs();
            })
            getDataService.getData('departments').then(function(departments) {
              vm.departments = departments[0];
            })
            vm.payoffData = angular.copy(vm.payoffDataInitial);
            $('#payoffModal').modal('toggle')
          } else {
            toastr.error('Could not insert deposit', 'Deposit')
          }
        })
      }
    }

    vm.revoke_payoff = function(payoff) {
      var data = {revoked: true};
      putDataService.putData('/payoff/' + payoff.id, data).then(function(res) {
        if (res['result'] === 'updated') {
          toastr.success('Revoked', 'Payoff');
          getDataService.getData('payoffs').then(function(payoffs) {
            vm.payoffs = payoffs[0];
            extend_payoffs();
          })
          getDataService.getData('departments').then(function(departments) {
            vm.departments = departments[0];
          })
        } else {
          toastr.success('Could not revoke payoff', 'Payoff');
        }
      })
    }

    vm.insert_departmentpurchases = function() {
      if (vm.dpurchaseData.dpurchases.length > 0) {
        var data = {
          dpurchases: [],
          department_id: vm.dpurchaseData.department.id,
          admin_id: $localStorage.admin.id
        }
        for (var dpurchase of vm.dpurchaseData.dpurchases) {
          var d = {
            product_id: dpurchase.product.id,
            amount: dpurchase.amount,
            price: dpurchase.price
          }
          data.dpurchases.push(d);
        }
        postDataService.postData('/departmentpurchases', data).then(function(res) {
          if (res['result'] === 'created') {
            getDataService.getData('payoffs').then(function(payoffs) {
              vm.payoffs = payoffs[0];
              extend_payoffs();
            })
            getDataService.getData('departments').then(function(departments) {
              vm.departments = departments[0];
            })
            $('#departmentpurchaseModal').modal('toggle');
            vm.dpurchaseData = angular.copy(vm.dpurchaseDataInitial);
            vm.dpurchase = angular.copy(vm.dpurchaseInitial);
            toastr.success('Success', 'Department purchases')
          } else {
            toastr.error('Could not insert departmentpurchases', 'Department purchases')
          }
        })
      }
    }

    function initController() {
      vm.admin = $localStorage.admin;
      return $q.all([
        getDataService.getData('departments').then(function(departments) {
          vm.departments = departments[0];
        }),
        getDataService.getData('payoffs').then(function(payoffs) {
          vm.payoffs = payoffs[0];
        }),
        getDataService.getData('products').then(function(products) {
          vm.products = products[0];
        })
      ])
    }
  }

})();
