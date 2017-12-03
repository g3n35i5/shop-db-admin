(function() {
  'use strict';

  angular
    .module('ShopDBAdmin')
    .controller('HomeController', ['$scope', '$localStorage', '$q',
      'getDataService', 'getStockHistoryService', '$filter', Controller
    ]);

  function Controller($scope, $localStorage, $q, getDataService, getStockHistoryService, $filter) {
    var vm = this;
    vm.loading = true;

    initController().then(handleData).then(doShits)

    function doShits() {
      vm.quickLinks = [{
          title: "Consumers",
          array: vm.consumers,
          link: "#!/consumers",
          icon: "fa fa-users",
          color: "bg-primary"
        },
        {
          title: "Products",
          array: vm.products,
          link: "#!/products",
          icon: "fa fa-coffee",
          color: "bg-success"
        },
        {
          title: "Purchases",
          array: vm.purchases,
          link: "#!/purchases",
          icon: "fa fa-shopping-cart",
          color: "bg-info"
        },
        {
          title: "Departments",
          array: vm.departments,
          link: "#!/departments",
          icon: "fa fa-fort-awesome",
          color: "bg-danger"
        }
      ];
    }

    function handleData() {
      var purchaseTimes = {};
      purchaseTimes['labels'] = vm.statistics[0].purchase_times['labels'];
      purchaseTimes['data'] = [];
      purchaseTimes['legend'] = [];

      var incomesExpenses = {};
      incomesExpenses['labels'] = [];
      incomesExpenses['data'] = [[],[]];
      incomesExpenses['series'] = ["Incomes", "Expenses"];

      // Handle statistics
      for (var stat of vm.statistics) {
        var department = vm.departments.find(x => x.id === stat.department_id);

        // Handle purchase times
        purchaseTimes['data'].push(stat.purchase_times['data']);
        purchaseTimes['legend'].push(department.name);

        // Handle incomes and expenses
        var incomes = (department.income_base + department.income_karma) / 100;
        var expenses = department.expenses / 100;

        incomesExpenses['labels'].push(department.name);
        incomesExpenses['data'][0].push(incomes);
        incomesExpenses['data'][1].push(expenses);
      }
      // Set statisctics
      vm.purchaseTimes = purchaseTimes;
      vm.incomesExpenses = incomesExpenses;
      //vm.topProducts = topProducts;

      // Admin roles
      vm.adminRoles = $filter('adminRoles')(vm.admin.adminroles,
        vm.departments);

      // Chart settings
      vm.tpChartOptions = {
        legend: {
          display: true,
          position: 'bottom'
        }
      };

      vm.ptChartOptions = {
        legend: {
          display: true,
          position: 'top'
        },
        elements: {
          point: {
            radius: 0
          }
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Hours'
            },

          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Percent'
            },

          }]
        }
      };

      vm.ieChartColors = ['#81C784', '#E57373'];
      vm.ieChartOptions = {
        legend: {
          display: true,
          position: 'top'
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            },
            scaleLabel: {
              display: true,
              labelString: 'Euro'
            }
          }]
        }
      };
      vm.loading = false;
    }

    function initController() {
      vm.admin = $localStorage.admin;
      return $q.all([
        getDataService.getData('consumers').then(function(consumers) {
          vm.consumers = consumers[0];
        }),
        getDataService.getData('departments').then(function(departments) {
          vm.departments = departments[0];
        }),
        getDataService.getData('payoffs').then(function(payoffs) {
          vm.payoffs = payoffs[0];
        }),
        getDataService.getData('purchases').then(function(purchases) {
          vm.purchases = purchases[0];
        }),
        getDataService.getData('products').then(function(products) {
          vm.products = products[0];
        }),
        getDataService.getData('statistics').then(function(statistics) {
          vm.statistics = statistics;
        })
      ])
    }
  }

})();
