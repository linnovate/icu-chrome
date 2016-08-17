'use strict';

var app = angular.module("app", []);

app.controller('optionsCtrl', function($scope, $http) {

  app.services($scope, $http);
  app.apps($scope);

  ($scope.get = function() {
    chrome.storage.sync.get(defaults, function(data) {
      $scope.selected = data;
      $scope.$apply();
    })
  })()

  $scope.save = function() {
    console.log($scope.selected)
    chrome.storage.sync.set($scope.selected, function() {
      $scope.get();
      if(!chrome.runtime.lastError) return;
      console.error(chrome.runtime.lastError)
    })
  }

  $scope.reset = function() {
    chrome.storage.sync.set(defaults, function() {
      $scope.get();
      if(!chrome.runtime.lastError) return;
      console.error(chrome.runtime.lastError)
    })
  }

  $scope.$watch('lang', function() {
    chrome.storage.sync.set({
      lang: $scope.lang
    }, function() {
      $scope.get();
      if(!chrome.runtime.lastError) return;
      console.error(chrome.runtime.lastError)
    })
  })

});