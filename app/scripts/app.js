'use strict';

var app = angular.module("app", []);

app.controller('icuCtrl', function ($scope, $http) {

  app.services($scope, $http);
  app.apps($scope);

  $scope.locale = {};


  chrome.storage.sync.get(defaults, function(data) {
    console.log(data)
    $scope.selected = data;
    var google = [];
    for(var n in data.services) {
      let s = data.services[n];
      if(s.name == 'google') {
        google.push(n);
      } else {
        $scope.services[n][s.name](s);
      }
    }
    if(google.length) $scope.googleAuth(google);

    if (data.lang == 'he') {
      $scope.locale = locale;
    } else {
      for (var n in locale) {
        $scope.locale[n] = n;
      }
    }

    $scope.tabs = {
      meetings: {
        title: $scope.locale.meetings,
        items: []
      },
      tasks: {
        title: $scope.locale.tasks,
        items: []
      },
      projects: {
        title: $scope.locale.projects,
        items: []
      }
    }

    $scope.apps = data.apps.map(function(app) {
      return $scope.apps.find(function(a) {return app == a.class});
    })

    $scope.$apply();

  })

  $scope.active = 'meetings';

  $scope.activate = function(name) {
    $scope.active = name;
  };

  $scope.meetsDist = function(item) {
    let distance = new Date(item.start.dateTime).getTime() - Date.now();
    distance = Math.round(distance / 60000)
    if(distance < 0) {

      item.style = {
        color: '#f06f1b',
        width: '80%'
      }
      if(new Date(item.end.dateTime).getTime < Date.now()) {
        item.style.text = ' '+$scope.locale.passed;
      } else {
        item.style.text = ' '+$scope.locale['now !'];
      }

    } else if (distance < 10) {
      item.style = {
        color: '#f06f1b',
        width: '80%',
        text: ' '+$scope.locale['in N minutes'].replace('N', distance)
      }
    } else if (distance < 60) {
      item.style = {
        color: '#00bfec',
        width: '30%',
        text: ''
      }
    } else if (distance < 120) {
      item.style = {
        color: '#00bfec',
        width: '30%',
        text: ''
      }
    } else {
      item.style = {
        color: '#8fc53d',
        width: '5%',
        text: ''
      }
    }
    return item;
  }

})






app.filter('caps', function() {
  return function(txt) {
    if(!txt) return;
    return txt.replace(/^([a-z]{1})/, function(match, p1) {
      return p1.toUpperCase();
    });
  }
})
.filter('camelcase', function() {
  return function(txt) {
    if(!txt) return;
    return txt.replace(/\b[a-z]/g, function(match) {
      return match.toUpperCase();
    });
  }
});
