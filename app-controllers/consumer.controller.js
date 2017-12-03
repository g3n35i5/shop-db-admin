(function() {
  'use strict';

  angular
    .module('ShopDBAdmin')
    .controller('ConsumerController', ['$scope', '$localStorage', '$q',
      'getDataService', 'postDataService', 'putDataService', '$filter', Controller
    ]);

  function Controller($scope, $localStorage, $q, getDataService, postDataService, putDataService, $filter) {
    var vm = this;
    vm.loading = true;
    vm.depositDataInitial = {
      amount: 0,
      comment: null,
      consumer: null,
      error: false,
      errorMessage: null,
      categories: [
        {
          text: 'Einzahlung auf Saalkonto',
          standalone: true
        },
        {
          text: 'Einzahlung in Barkasse',
          standalone: true
        },
        {
          text: 'Einkauf',
          standalone: false
        },
        {
          text: 'Sonstiges',
          standalone: false
        }
      ],
      selectedCategory: {standalone: true}
    }

    vm.editConsumerDataInitial = {
      consumer: null,
      editedConsumer: null,
      error: false,
      messages: []
    }

    vm.addConsumerDataInitial = {
      consumer: {},
      error: false,
      errorMessage: null
    }

    vm.depositData = angular.copy(vm.depositDataInitial);
    vm.editConsumerData = angular.copy(vm.editConsumerDataInitial);
    vm.addConsumerData = angular.copy(vm.addConsumerDataInitial);

    // consumer list filters
    vm.sortType = 'name';
    vm.sortReverse = false;
    vm.searchString = '';

    initController().then(handleData)

    function handleData() {
      vm.loading = false;
    }

    vm.makeDeposit = function() {
      if (![0, '', null].includes(vm.depositData.amount)) {
        var comment = vm.depositData.selectedCategory.text;
        if (!vm.depositData.selectedCategory.standalone) {
          comment += ':' + vm.depositData.selectedCategory;
        }
        vm.depositData.comment
        var data = {
          consumer_id: vm.depositData.consumer.id,
          amount: vm.depositData.amount,
          comment: comment
        };
        postDataService.postData('/deposits', data).then(function(res) {
          if (res['result'] === 'created') {
            getDataService.getData('consumers').then(function(consumers) {
              vm.consumers = consumers[0];
            })
            $('#makeDepositModal').modal('toggle');
            vm.depositData = angular.copy(vm.depositDataInitial);
          } else {
            vm.depositData.error = true;
            vm.depositData.errorMessage = 'Something went wrong!'
          }
        })
      }
    }

    vm.addConsumer = function () {
      var data = {
        'name': vm.addConsumerData.consumer.name
      }
      postDataService.postData('/consumers', data).then(function(res) {
        if (res['result'] === 'created') {
          getDataService.getData('consumers').then(function(consumers) {
            vm.consumers = consumers[0];
          })
          $('#addConsumerModal').modal('toggle');
          vm.addConsumerData = angular.copy(vm.addConsumerDataInitial);
        } else {
          vm.addConsumerData.error = true;
          vm.addConsumerData.errorMessage = 'Something went wrong!'
        }
      })
    }

    vm.editConsumer = function() {
      var original = vm.editConsumerData.consumer;
      var edited = vm.editConsumerData.editedConsumer;

      updateConsumer(original, edited, showResult);

      function updateConsumer(original, edited, callback) {
        if (original !== edited) {
          var passwordsMatch = edited.password === edited.repeatpassword;
          delete edited.repeatpassword;
          if (passwordsMatch) {
            for (var property in edited) {
              console.log(property);
              if (edited.hasOwnProperty(property)) {
                if (original.hasOwnProperty(property)) {
                  if (original[property] === edited[property]) {
                    // Nothing has changed
                    continue;
                  }
                }
                var data = {};
                data[property] = edited[property];

                putDataService.putData('/consumer/' + original.id, data).then(function(res) {
                  var message = {
                    message: res['message']
                  };
                  if (!res['result']) {
                    vm.editConsumerData.error = true;
                    message['class'] = 'alert-danger';
                  } else {
                    message['class'] = 'alert-success';
                  }
                  vm.editConsumerData.messages.push(message);
                })
              }
            }
          } else {
            vm.editConsumerData.error = true;
            var message = {
              message: 'Passwords do not match!'
            };
            message['class'] = 'alert-danger';
          }
        }
        callback();
      }

      function showResult() {
        if (!vm.editConsumerData.error) {
          $('#editConsumerModal').modal('toggle')
          getDataService.getData('consumers').then(function(consumers) {
            vm.consumers = consumers[0];
          })
          vm.editConsumerData = angular.copy(vm.editConsumerDataInitial);
        }
      }
    }

    vm.openDepositModal = function(consumer) {
      vm.depositData.consumer = angular.copy(consumer);
      $('#makeDepositModal').modal('toggle')
    }

    vm.openAddConsumerModal = function() {
      $('#addConsumerModal').modal('toggle')
    }

    vm.openEditConsumerModal = function(consumer) {
      var adminroles = {};
      for (var role of consumer.adminroles) {
        adminroles[role.department_id] = true;
      }
      consumer.adminroles = adminroles;
      vm.editConsumerData.consumer = angular.copy(consumer);
      vm.editConsumerData.editedConsumer = angular.copy(consumer);
      $('#editConsumerModal').modal('toggle')
    }

    function initController() {
      vm.admin = $localStorage.admin;
      return $q.all([
        getDataService.getData('consumers').then(function(consumers) {
          vm.consumers = consumers[0];
        }),
        getDataService.getData('departments').then(function(departments) {
          vm.departments = departments[0];
        })
      ])
    }
  }
})();
