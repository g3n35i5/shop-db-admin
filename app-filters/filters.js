angular.module('ShopDBAdmin').filter('customCurrency', function() {
  return function(input, cents) {
    if (isNaN(input)) {
      return input;
    } else {
      var cents = cents === undefined ? true : cents;
      if (cents === true) {
        return (input / 100).toFixed(2) + ' €';
      } else {
        return input.toFixed(2) + ' €';
      }
    }
  }
})

angular.module('ShopDBAdmin').filter('longStrings', function() {
  return function(input, length) {
    if (typeof(input) != "string") {
      return input;
    } else {
      var length = length === undefined ? 30 : length;
      if (input.length <= length) {
        return input;
      } else {
        return input.substring(0, length - 3) + '...';
      }
    }
  }
})

angular.module('ShopDBAdmin').filter('stockFilter', function() {
  return function(input) {
    if (isNaN(input)) {
      return '-';
    } else if (typeof(input) === "undefined") {
      return '-';
    } else if (input <= 0) {
      return '-';
    } else {
      return input;
    }
  }
})

angular.module('ShopDBAdmin').filter('customDateString', function($filter) {
  return function(input) {
    var oneDay = 24 * 60 * 60 * 1000;
    date1 = new Date()
    date2 = new Date(input)
    d1 = date1.getDay()
    d2 = date2.getDay()

    var diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime()) / (oneDay)));
    if (diffDays == 0) {
      return 'Today'
    } else if (diffDays == 1) {
      return 'Yesterday'
    } else if (diffDays < 5) {
      return diffDays + ' days ago'

    } else {
      return $filter('date')(date2, "dd.MM.yyyy")
    }
  }
})

angular.module('ShopDBAdmin').filter('greeting', function() {
  return function() {
    var thehours = new Date().getHours();

    if (thehours >= 0 && thehours < 12) {
      return 'Good morning'
    } else if (thehours >= 12 && thehours < 17) {
      return 'Good afternoon'

    } else if (thehours >= 17 && thehours < 24) {
      return 'Good evening'
    } else {
      return 'Hello'
    }
  }
});

angular.module('ShopDBAdmin').filter('adminRoles', function() {
  return function(roles, departments) {
    var names = [];
    for (role of roles) {
      names.push(departments[role.department_id].name);
    }
    var return_string = '';
    if (names.length > 1) {
      for (var i = 0; i < names.length - 1; i++) {
        return_string += names[i];
        if (i < names.length - 2) {
          return_string += ', ';
        }
      }
      return_string += ' and ' + names.slice(-1)[0];
    } else {
      return names[0];
    }
    return return_string;
  }
});
