'use strict';

var app = angular.module("app", []);

app.controller('optionsCtrl', function($scope, $http) {

  app.services($scope, $http);
  app.apps($scope);

  $scope.apps = $scope.apps.map(function(app){return app.class});



  ($scope.get = function() {
    chrome.storage.sync.get(defaults, function(data) {
      $scope.selected = data;
      $scope.$apply();
      $scope.setApps();
    })
  })()

  $scope.save = function() {
    chrome.storage.sync.set($scope.selected, function() {
      $scope.get();
      if(!chrome.runtime.lastError) return;
      console.error(chrome.runtime.lastError)
    })
  }

  $scope.open = function(){
  $scope.openbr.openCamera();
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




  $scope.dragstart = function(event) {
    var app = event.srcElement.id;
    event.dataTransfer.setData('app', app)
  }
  $scope.dragover = function(event) {
    event.preventDefault();
  }
  $scope.drop = function(event) {
    var id = event.dataTransfer.getData('app');
    if(!id) return;
    var app = document.getElementById(id);
    if(this == event.srcElement) {
      var index = Math.round((event.offsetY) / 50);
      this.insertBefore(app, this.children[index]);
    } else {
      if(event.offsetY > event.srcElement.offsetHeight / 2) {
        this.insertBefore(app, event.srcElement.nextElementSibling);
      } else {
        this.insertBefore(app, event.srcElement);
      }
    }
    $scope.setApps();
  }

  $scope.setApps = function() {
    var apps = document.getElementById('selected').childNodes;
    $scope.selected.apps = Object.keys(apps).map(function(key){
      return apps[key].id;
    }).filter(function(e){
      return  e;
    });

    $scope.suggestedApps = $scope.apps.filter(function(app) {
      return !$scope.selected.apps.find(function(a){return a == app});
    })
    $scope.$apply();
  }

  var apps = document.getElementById('suggested');
  apps.addEventListener('dragstart', $scope.dragstart)
  apps.addEventListener('dragover', $scope.dragover)
  apps.addEventListener('drop', $scope.drop)

  var selected = document.getElementById('selected');
  selected.addEventListener('dragstart', $scope.dragstart)
  selected.addEventListener('dragover', $scope.dragover)
  selected.addEventListener('drop', $scope.drop)


});

