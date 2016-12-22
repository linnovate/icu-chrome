'use strict';


app.controller('optionsCtrl', function($scope, $http, $rootScope) {

  app.services($scope, $http, $rootScope);
  app.apps($scope);

  $scope.tabsOpts = {
    profile: {
      title: 'profile',
      items: []
    },
    tools: {
      title: 'tools',
      items: []
    },
    services: {
      title: 'services',
      items: []
    }
  }
  $scope.active = 'profile';

  $scope.close = function() {
    $scope.$dismiss('cancel');
  }

  chrome.storage.sync.get(defaults, function(data) {

    if (data.lang == 'he') {
      $scope.locale = locale;
    } else {
      $scope.locale = {};
      for (var n in locale) {
        $scope.locale[n] = n;
      }
    }
  });

  $scope.activate = function(name) {
    $scope.active = name;
  };

  $scope.apps = $scope.availableApps.map(function(app) {
    return app.class
  });

  ($scope.get = function(cb) {
    chrome.storage.sync.get(defaults, function(data) {
      $scope.selected = data;
      $scope.$apply();
      $scope.setApps();
      if (cb) {
        return(cb());
      }
    })
  })()

  $scope.save = function() {
    chrome.storage.sync.set($scope.selected, function() {
      $scope.get(function(){
        $scope.$dismiss('save');
      });
      $rootScope.$emit('resetTab');
      if (!chrome.runtime.lastError) return;
      console.error(chrome.runtime.lastError);
    })
  }

  $scope.reset = function() {
    // chrome.storage.sync.set(defaults, function() {
    //   $scope.get();
    //   if (!chrome.runtime.lastError) return;
    //   console.error(chrome.runtime.lastError)
    // })
    $scope.$dismiss('cancel');
  }

  $scope.$watch('lang', function() {
    chrome.storage.sync.set({
      lang: $scope.lang
    }, function() {
      $scope.get();
      if (!chrome.runtime.lastError) return;
      console.error(chrome.runtime.lastError)
    })
  })

  $scope.moveToSelected = function(name) {
    var index = $scope.suggestedApps.indexOf(name);
    $scope.suggestedApps.splice(index, 1);
    $scope.selected.apps.push(name);
  }

  $scope.moveToSuggests = function(name) {
    var index = $scope.selected.apps.indexOf(name);
    $scope.selected.apps.splice(index, 1);
    $scope.suggestedApps.push(name);
  }


  $scope.dragstart = function(event) {
    var app = event.srcElement.id;
    event.dataTransfer.setData('app', app)
  }
  $scope.dragover = function(event) {
    event.preventDefault();
  }
  $scope.drop = function(event) {
    var id = event.dataTransfer.getData('app');
    if (!id) return;
    var app = document.getElementById(id);
    if (this == event.srcElement) {
      var index = Math.round((event.offsetY) / 50);
      this.insertBefore(app, this.children[index]);
    } else {
      if (event.offsetY > event.srcElement.offsetHeight / 2) {
        this.insertBefore(app, event.srcElement.nextElementSibling);
      } else {
        this.insertBefore(app, event.srcElement);
      }
    }
    $scope.setApps();
  }

  $scope.setApps = function() {
    var apps = document.getElementById('selected').childNodes;
    $scope.selected.apps = Object.keys(apps).map(function(key) {
      return apps[key].id;
    }).filter(function(e) {
      return e;
    });

    $scope.suggestedApps = $scope.apps.filter(function(app) {
      return !$scope.selected.apps.find(function(a) {
        return a == app
      });
    })
    $scope.$apply();
  }
  $scope.onOver = function(e) {
    angular.element(e.target).addClass("hover");
  };
  $scope.onOut = function(e) {
    angular.element(e.target).removeClass("hover");
  };
  $scope.onDrop = function(e) {
    angular.element(e.target).removeClass("hover");
  };

  var apps = document.getElementById('suggested');
  apps.addEventListener('dragstart', $scope.dragstart)
  apps.addEventListener('dragover', $scope.dragover)
  apps.addEventListener('drop', $scope.drop)

  var selected = document.getElementById('selected');
  selected.addEventListener('dragstart', $scope.dragstart)
  selected.addEventListener('dragover', $scope.dragover)
  selected.addEventListener('drop', $scope.drop)


});