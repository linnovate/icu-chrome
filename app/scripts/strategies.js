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
      $scope.tabs.meetings.items = res.data.items.map(function(item) {
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
      var urls = eval(match);
      var index = Math.round(Math.random() * urls[0].length);
      console.log('index: ', index);
      console.log('urls: ', urls);
      console.log('url: ', urls[0][index]);
      var url = urls[0][index - 1][0];
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


var strategies = {
  google: {
    background: function() {
      $http({
        method: 'GET',
        url: 'https://clients3.google.com/cast/chromecast/home'
      }).then(function(res) {
        var match = res.data.match(/JSON\.parse\('.+'\)(?=\)\.)/)[0];
        var urls = eval(match);
        var index = Math.round(Math.random() * urls[0].length);
        var url = urls[0][index - 1][0];
        document.body.style.backgroundImage = 'url("' + url + '")';
      })
    },

    profile: function(token) {
      $http({
        method: 'GET',
        url: 'https://content.googleapis.com/plus/v1/people/me',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }).then(function(res) {
        $scope.profile.name = res.data.name.givenName;
        $scope.profile.image = res.data.image.url;
      })
    },

    meetings: function(token) {
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
        $scope.tabs.meetings.items = res.data.items.map(function(item) {
          return item;
        });
      })
    },

    login: function(callback) {
      chrome.identity.getAuthToken({
        interactive: true
      }, function(token) {
        if(!token) return console.error('Error: Google getAuthToken respond with no token');
        console.log(token)
        chrome.identity.removeCachedAuthToken({
          token: token
        })
        callback(token)
      })
    }
  },

  custom: {
    background: function(req, parseUrl) {
      $http(req).then(function(res) {
        url = parseUrl(res.data);
        document.body.style.backgroundImage = 'url("' + url + '")';
      })
    },
    profile: function(req, parseName, parseImg) {
      $http(req).then(function(res) {
        $scope.profile.name = parseName(res.data);
        $scope.profile.image = parseImg(res.data);
      })
    },
    meetings: function(req, parseItems) {
      $http(req).then(function(res) {
        $scope.tabs.meetings.items = parseItems(res.data)
      })
    }
  }
}