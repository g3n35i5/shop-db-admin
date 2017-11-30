(function() {
  'use strict';

  angular
    .module('ShopDBAdmin')
    .controller('StockhistoryController', ['$scope', '$localStorage',
      'getDataService', 'getStockHistoryService', '$filter', Controller
    ]);

  function Controller($scope, $localStorage, getDataService,
    getStockHistoryService, $filter) {
    var vm = this;
    vm.loading = true;
    initController().then(handleData)

    // set default dates for stockhistory datepicker
    vm.start_date = new Date();
    vm.start_date.setMonth(vm.start_date.getMonth() - 1);
    vm.end_date = new Date();

    let $datepickers;
    $datepickers = $(".datepicker")

    $datepickers.datepicker({
      format: "dd.MM.yyyy",
      weekStart: 1,
      todayBtn: true,
      clearBtn: true,
      autoclose: true,
      todayHighlight: true
    });

    vm.getStockHistory = function(id) {
      return getStockHistoryService.getStockHistory(id, vm.start_date, vm.end_date).then(function(response) {
        vm.stockhistory = response;
      }).then(function() {
        var hist = vm.stockhistory;
        vm.stockhistory = {};
        vm.stockhistory['labels'] = [];
        vm.stockhistory['data'] = [];
        for (var h of hist) {
          var d = $filter('date')(Date.parse(h.timestamp), "dd. MMM")
          vm.stockhistory['labels'].push(d);
          vm.stockhistory['data'].push(h.new_stock);
        }
      })
    };

    function handleData() {
      vm.loading = false;

    }

    function initController() {
      vm.consumer = $localStorage.currentConsumer;

      return getDataService.getData('consumers').then(function(consumers) {
        vm.consumers = consumers[0];
      });
    }
  }

})();
