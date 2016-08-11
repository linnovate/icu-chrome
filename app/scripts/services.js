'use strict';

app.expandController = function($scope, $http) {

  $scope.services = {

    background: {
      google: function() {
        $http({
          method: 'GET',
          url: 'https://clients3.google.com/cast/chromecast/home'
        }).then(function(res) {
          var match = res.data.match(/JSON\.parse\('.+'\)(?=\)\.)/)[0];
          var urls = eval(match);
          var index = Math.round(Math.random() * (urls[0].length - 1));
          var url = urls[0][index][0];
          document.body.style.backgroundImage = 'url("' + url + '")';
          document.body.style.opacity = 'initial';
        }).catch(function(res) {
          $scope.services.background.local()
        })
      },

      custom: function(opts) {

        // login to remote server
        $http({
          method: 'POST',
          url: opts.url + '/api/login',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          data: {
            email: opts.email,
            password: opts.password
          }
        }).then(function(res) {

          // get background url for today
          $http({
            method: 'POST',
            url: opts.url + '/api/backgroundImage/example/imagesForMonth',
            headers: {
              'Authorization': 'Bearer ' + res.data.token,
              'Content-Type': 'application/json;charset=UTF-8'
            },
            data: {
              month: new Date().getMonth()
            }
          }).then(function(res) {
            console.log('custom images:', res.data)
            for(var n in res.data) {
              let imgDate = new Date(res.data[n].forDate).setHours(0,0,0,0);
              let today = new Date().setHours(0,0,0,0);
              if(imgDate == today) {
                document.body.style.backgroundImage = 'url("http://bg.hrm.demo.linnovate.net' + res.data[n].src + '")';
                document.body.style.opacity = 'initial';
              }
            }
          }).catch(function(res) {
            $scope.services.background.local()
          })
        }).catch(function(res) {
          $scope.services.background.local()
        })
      },

      local: function() {
        document.body.style.backgroundImage = 'url("../images/dd_20141001_7212_master.jpg")';
        document.body.style.opacity = 'initial';
      }
    },



    profile: {
      google: function (token) {
        $http({
          method: 'GET',
          url: 'https://content.googleapis.com/plus/v1/people/me',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }).then(function(res) {
          $scope.profile = {
            name: res.data.name.givenName,
            image: res.data.image.url
          }
        })
      },

      custom: function() {
        console.log('executed profile custom function')
      }
    },



    meetings: {
      google: function(token) {
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
          console.log('google calendar events:', res.data.items)
          $scope.tabs.meetings.items = res.data.items;
        })
      },

      custom: function() {
        console.log('executed meetings custom function')
      }
    },



    projects: {
      google: function() {
        console.log('executed projects google function')
      },

      custom: function(opts) {

        // login to remote server
        $http({
          method: 'POST',
          url: opts.url + '/api/login',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          data: {
            email: opts.email,
            password: opts.password
          }
        }).then(function(res) {

          var token = res.data.token;
          $scope.users = {};
          var usersSource = {
            projects: false,
            tasks: false
          };

          var getUsers = function() {
            if(!usersSource.projects || !usersSource.tasks) return;

            // get creators details
            for (var n in $scope.users) {
              $http({
                method: 'GET',
                url: opts.url + '/api/users/' + n,
                headers: {
                  'Authorization': 'Bearer ' + token
                }
              }).then(function(res) {
                $scope.users[n] = res.data;
                if(res.data.email == opts.email) {
                  $scope.users[n].name = $scope.locale.me;
                }
              }).catch(function(res) {
                console.log(res)
              })
            }
            
          }


          // get projects
          $http({
            method: 'GET',
            url: opts.url + '/api/projects',
            params: {
              start: 0,
              limit: 0,
              sort: 'created'
            },
            headers: {
              'Authorization': 'Bearer ' + token
            }
          }).then(function(res) {
            console.log('custom projects:', res.data.content);
            $scope.tabs.projects.items = res.data.content;

            res.data.content.forEach(function(p) {
              $scope.users[p.creator] = {};
            });
            usersSource.projects = true;
            getUsers();

          }).catch(function(res) {
            console.log(res)
          })

          // get tasks
          $http({
            method: 'GET',
            url: opts.url + '/api/tasks',
            params: {
              start: 0,
              limit: 0,
              sort: 'created'
            },
            headers: {
              'Authorization': 'Bearer ' + token
            }
          }).then(function(res) {
            console.log('custom tasks:',res.data.content);
            $scope.tabs.tasks.items = res.data.content;

            res.data.content.forEach(function(t) {
              $scope.users[t.creator] = {};
            });
            usersSource.tasks = true;
            getUsers();

          }).catch(function(res) {
            console.log(res)
          })


        }).catch(function(res) {
          console.log(res)
        })

      }
    }
  }




  $scope.googleAuth = function(services) {
    for(var n in services) {
      if($scope.services[services[n]].google.toString().slice(9,11) == '()') {
        $scope.services[services[n]].google()
        services.splice(n,1)
      }
    }
    chrome.identity.getAuthToken({
      interactive: true
    }, function(token) {
      if(!token) return console.error('Error: login to Google failed');
      console.log(token)
      chrome.identity.removeCachedAuthToken({
        token: token
      })
      for(var n in services) {
        $scope.services[services[n]].google(token);
      }
    })
  }

};