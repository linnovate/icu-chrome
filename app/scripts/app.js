'use strict';

angular.module("app", [])
    .controller('icuCtrl', function ($scope, $http) {

    $scope.tabs = ['meetings','tasks','project'].map(function(item, i){
        return {
            id: i,
            title: item,
            items: []
        }
    })
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
                timeMin: new Date(1465826445308).toISOString(), // 1465826445308
                singleEvents: true,
                showDeleted: false,
                orderBy: 'startTime',
                maxResults: 10
            },
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(function(res){
            $scope.tabs[0].items = res.data.items.map(function(item){
                return item;
            })
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

    $http({
        method: 'POST',
        url: 'http://icu.dev9.linnovate.net:3000/api/login',
        data: {
            email: "avraham@linnovate.net",
            password: "036164978"
        }
    }).then(function(res){
        console.log(res);
    })

    $scope.selected = 0;

    $scope.select= function(index) {
       $scope.selected = index; 
    };

});
