'use strict';

var app = angular.module("app", []);

app.controller('icuCtrl', function ($scope, $http) {

  $scope.profile = {};

  app.expandController($scope, $http)

  $scope.tabs = {
    meetings: {items: []},
    tasks: {items: []},
    project: {items: []}
  }

/*  $scope.tabs = ['meetings','tasks','project'].map(function(item, i){
    return {
      id: i,
      title: item,
      items: []
    }
  });*/


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
        return ' now!';
      } else {
        return ' passed'
      }
    } else if(dist <= 10) {
      return ' in ' + dist + ' minutes';
    }
  }

});
