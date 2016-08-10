'use strict';

var app = angular.module("app", []);

app.controller('icuCtrl', function ($scope, $http) {

  app.expandController($scope, $http);

  $scope.locale = {};

  chrome.storage.sync.get({
    lang: 'en'
  }, function(data) {
    $scope.lang = data.lang;
    $http({
      method: 'GET',
      url: 'scripts/' + data.lang + '.json'
    }).then(function(res) {
      for (var n in res.data) {
        $scope.locale[n] = res.data[n];
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
    })
  })

  chrome.storage.sync.get({
    providers: {
      background: {
        name: 'google'
      },
      meetings: {
        name: 'google'
      },
      profile: {
        name: 'google'
      },
      projects: {
        name: 'google'
      }
    }
  }, function(data) {
    var google = [];
    for(var n in data.providers) {
      let p = data.providers[n];
      if(p.name == 'google') {
        google.push(n);
      } else {
        $scope.services[n][p.name](p);
      }
    }
    if(google.length) $scope.googleAuth(google);
  })

  $scope.closeMeets = function(date) {

    var distance = new Date(date).getTime() - new Date().getTime();
    distance = Math.ceil(distance / (60*60*1000));

    if(distance < 0) distance = 0;

    var style = {};
    switch (distance) {
      case 0:
      case 1:
        style = {
          color: '#f06f1b',
          width: '80%'
        };
      break;
      case 2:
        style = {
          color: '#00bfec',
          width: '30%'
        }
      break;
      default:
        style = {
          color: '#8fc53d',
          width: '5%'
        }
      break;
    };

    style['border-bottom-color'] = style.color;
    delete style.color;
    return style;
  }


  $scope.selected = 'meetings';


  $scope.select= function(index) {
    $scope.selected = index; 
  };


  $scope.getDist = function(a, b) {
    var dist = Math.round((new Date(a).getTime() - new Date().getTime()) / 60000);
    if(dist < 0 ) {
      if(Math.round((new Date(b).getTime() - new Date().getTime()) / 60000) > 0) {
        return ' ' + $scope.locale.now;
      } else {
        return ' ' + $scope.locale.passed;
      }
    } else if(dist <= 10) {
      return ' ' + $scope.locale['in N minutes'].replace('N', dist);
    } else {
      return '';
    }
  }

});
