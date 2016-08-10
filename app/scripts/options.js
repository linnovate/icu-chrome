'use strict';

var app = angular.module("app", []);

app.controller('optionsCtrl', function($scope, $http) {

  app.expandController($scope, $http);

  $scope.langs = ['en', 'he'];

  ($scope.get = function() {
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
      },
      lang: 'en'
    }, function(data) {
      $scope.choosen = data.providers;
      $scope.lang = data.lang;
      $scope.$apply();
    })
  })()

  $scope.save = function() {
    chrome.storage.sync.set({
      providers: $scope.choosen
    }, function() {
      $scope.get();
      if(!chrome.runtime.lastError) return;
      console.error(chrome.runtime.lastError)
    })
  }

  $scope.reset = function() {
    chrome.storage.sync.remove('providers', function() {
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