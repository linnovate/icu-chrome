app.expandController = function($scope, $http) {

  var getUserInfo = function(token) {

    $http({
      method: 'GET',
      url: 'https://content.googleapis.com/plus/v1/people/me',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(function(res) {
      $scope.profile.image = res.data.image.url;
      $scope.profile.name = res.data.name.givenName;
    })

  }

  var getMeetingsInfo = function(token) {
    $http({
      method: 'GET',
      url: 'https://content.googleapis.com/calendar/v3/calendars/primary/events',
      params: {
        timeMin: new Date().toISOString(), // (1465654232773)
        timeMax: new Date(new Date().setHours(23,59,59,999)).toISOString(), // end of day
        singleEvents: true,
        showDeleted: false,
        orderBy: 'startTime',
        maxResults: 100
      },
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(function(res) {
      console.log(res.data.items)
      $scope.tabs[0].items = res.data.items.map(function(item) {
        return item;
      });
    })
  }

  var getTasksInfo = function(token) {
    $http({
      method: 'GET',
      url: 'https://www.googleapis.com/tasks/v1/users/@me/lists',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(function(res) {
      console.log(res.data.items)
      $scope.tabs[1].items = res.data.items.map(function(item) {
        return item;
      })
    })
  }

  var getBackgroundImage = function() {
    $http({
      method: 'GET',
      url: 'https://clients3.google.com/cast/chromecast/home'
    }).then(function(res) {
      var match = res.data.match(/JSON\.parse\('.+'\)(?=\)\.)/)[0];
      var urls = eval(match)[0];
      var index = Math.round(Math.random() * urls.length);
      console.log('index: ', index)
      console.log('urls: ', urls)
      console.log('url: ', urls[index])
      var url = urls[index - 1][0];
      document.body.style.backgroundImage = 'url("' + url + '")';
      console.log(url);
    })
  }

  chrome.identity.getAuthToken({
    interactive: true
  }, function(token) {
    if(!token) return console.error('Error: Google getAuthToken respond with no token');
    console.log(token)
    chrome.identity.removeCachedAuthToken({
      token: token
    })
    getUserInfo(token)
    getMeetingsInfo(token)
    /*getTasksInfo(token)*/
  });

  getBackgroundImage()
};
