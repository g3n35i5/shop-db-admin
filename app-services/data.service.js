(function() {
  'use strict';

  angular
    .module('ShopDBAdmin')
    .service('getDataService', getData)
    .service('getStockHistoryService', getStockHistory)
    .service('postDataService', postData)
    .service('putDataService', putData);

  function getData($http, $localStorage, apiurl, $q) {

    return {
      getData: function(path) {
        var deferred = $q.defer();
        var allowedPaths = ['consumers', 'departments', 'payoffs', 'purchases',
          'products', 'statistics'
        ];
        var request = [];
        if (path === 'consumers') {
          request.push(makeRequest('consumers'));
        } else if (path === 'departments') {
          request.push(makeRequest('departments'));
        } else if (path === 'departmentpurchasecollections') {
          request.push(makeRequest('departmentpurchasecollections'));
        } else if (path === 'payoffs') {
          request.push(makeRequest('payoffs'));
        } else if (path === 'purchases') {
          request.push(makeRequest('purchases'));
        } else if (path === 'deposits') {
          request.push(makeRequest('deposits'));
        } else if (path === 'products') {
          request.push(makeRequest('products'));
        } else if (path === 'statistics') {
          var request = [];
          var adminRoles = $localStorage.admin.adminroles;
          for (var role of adminRoles) {
            request.push(makeRequest('department/' + role.department_id + '/statistics'));
          }
        } else if (path.startsWith('departmentpurchases')) {
          request.push(makeRequest(path));
        } else {
          deferred.reject();
          return deferred.promise;
        }

        $q.all(request).then(
          function(data) {
            deferred.resolve(data)
          }
        )
        return deferred.promise;
      }
    }

    function makeRequest(_url, limit) {

      var deferred = $q.defer();

      var token = $localStorage.token;
      if (!token) {
        delete $localStorage.token;
        deferred.reject()
      }
      var request_url = apiurl + "/" + _url;

      if (typeof limit !== "undefined") {
        request_url += "/" + limit;
      }

      $http.get(request_url, {
          headers: {
            'token': $localStorage.token
          }
        })
        // handle success
        .then(function(response) {
          if (response.data) {
            deferred.resolve(response.data);
          } else {
            delete $localStorage.token;
            deferred.reject();
          }
        }, function(error) {
          delete $localStorage.token;
          deferred.reject();
        });
      return deferred.promise;
    }
  }

  function postData($http, $localStorage, apiurl, $q) {
    return {
      postData: function(route, data) {
        var deferred = $q.defer();
        var token = $localStorage.token;
        if (!token) {
          delete $localStorage.token;
          token = null;
        }

        $http.post(apiurl + route, data, {
            headers: {
              'token': token
            }
          })
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject();
          });
        return deferred.promise;
      }
    }
  }

  function putData($http, $localStorage, apiurl, $q) {
    return {
      putData: function(route, data) {
        var deferred = $q.defer();
        var token = $localStorage.token;
        if (!token) {
          delete $localStorage.token;
          token = null;
        }

        $http.put(apiurl + route, data, {
            headers: {
              'token': token
            }
          })
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject();
          });
        return deferred.promise;
      }
    }
  }

  function getStockHistory($http, $localStorage, apiurl, $q) {

    return {
      getStockHistory: function(product_id, date_start, date_end) {
        var deferred = $q.defer();
        var token = $localStorage.token;
        if (!token) {
          delete $localStorage.token;
          deferred.reject()
        }

        $http.post(apiurl + '/stockhistory/' + product_id, {
            headers: {
              'token': $localStorage.token
            },
            date_start: typeof(date_start) === "undefined" ? null : date_start,
            date_end: typeof(date_end) === "undefined" ? null : date_end

          })
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject();
          });
        return deferred.promise;
      }
    }
  }
})();
