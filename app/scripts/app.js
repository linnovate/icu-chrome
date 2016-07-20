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
                timeMin: new Date().toISOString(), // (1450274445308)
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

/*    $http({
        method: 'POST',
        url: 'http://icu.dev9.linnovate.net:3000/api/login',
        data: {
            email: "avraham@linnovate.net",
            password: "036164978"
        }
    }).then(function(res){
        console.log(res);
    })*/

    $scope.selected = 0;

    $scope.select= function(index) {
     $scope.selected = index; 
 };

});
