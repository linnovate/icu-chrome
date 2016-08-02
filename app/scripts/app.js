'use strict';

angular.module("app", [])
.controller('icuCtrl', function ($scope, $http) {

  $scope.tabs = ['meetings','tasks','project'].map(function(item, i){
    return {
      id: i,
      title: item,
      items: []
    }
  });

  var getProfileInfo = function(token) {
    $http({
      method: 'GET',
      url: 'https://content.googleapis.com/plus/v1/people/me',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(function(res){
      $scope.profile = {
        image: res.data.image.url,
        name: res.data.name.givenName
      }
    })
  }

  var getCalendarEvents = function(token) {
    $http({
      method: 'GET',
      url: 'https://content.googleapis.com/calendar/v3/calendars/primary/events',
      params: {
        timeMin: new Date(1465981200000).toISOString(), // (1465654232773)
        timeMax: new Date(new Date().setHours(23,59,59,999)).toISOString(), // end of day
        singleEvents: true,
        showDeleted: false,
        orderBy: 'startTime',
        maxResults: 100
      },
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(function(res){
      $scope.tabs[0].items = res.data.items.map(function(item){
        return item;
      })
      console.log($scope.tabs[0].items)
    })
  }

  chrome.identity.getAuthToken({
    interactive: true
  }, function(token) {
    getCalendarEvents(token);
    getProfileInfo(token);
    chrome.identity.removeCachedAuthToken({
      token: token
    })
  });

/*  $http({
    method: 'POST',
    url: 'http://icu.dev9.linnovate.net:3000/api/login',
    data: {
      email: "avraham@linnovate.net",
      password: "036164978"
    }
  }).then(function(res){
    console.log(res);
  })*/


  $scope.closeMeets = function(date) {

    var distance = new Date(date).getTime() - new Date(1465981200000).getTime();
    distance = Math.ceil(distance / (24*60*60*1000));

    var style = {};
    switch (distance) {
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

  $scope.selected = 0;

  $scope.select= function(index) {
    $scope.selected = index; 
  };

  $scope.getDist = function(a, b) {
    var dist = Math.round((new Date(a).getTime() - new Date(1465984200000/* + 1200000 + 60*60*1000*/).getTime()) / 60000);
    if(dist < 0 ) {
      if(Math.round(new Date(b).getTime() - new Date(1465984200000/* + 1200000 + 60*60*1000*/).getTime()) > 0) {
        return ' now!';
      } else {
        return ' passed'
      }
    } else if(dist <= 10) {
      return ' in ' + dist + ' minutes';
    }
  }

});
