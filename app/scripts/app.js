'use strict';

angular.module("app", []);


angular.module('app').controller('icuCtrl', function ($scope,  $http) {
    $scope.image ='';
    $scope.server = 'http://localhost:3000';
    $http({
          method: 'GET',
          url: 'http://localhost:3000/api/images'
        }).then(function successCallback(response) {
            $scope.image = response.data.src;
            console.log('res', $scope.image);
          }, function errorCallback(response) {
            console.log('errorCallback', response)
    });



   var tabs = [
            {
                'tabId': 1,
                'title': 'meetings',
            },
            {
                'tabId': 2,
                'title': 'tasks',
            },
            {
               'tabId': 3,
                'title': 'project',
            }
        ]; 

    $scope.tabs = tabs;
    $scope.selected = 0;

    $scope.select= function(index) {
       $scope.selected = index; 
    };

});