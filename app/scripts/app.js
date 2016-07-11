'use strict';

angular.module("app", []);


angular.module('app').controller('icuCtrl', function ($scope) {

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