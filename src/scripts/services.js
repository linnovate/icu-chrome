'use strict';

app.services = function($scope, $http, $rootScope) {

  function setBackgroundImage(url) {
    document.body.style.background = 'url("' + url + '") 0% 0% / cover rgb(220,220,220)';
    document.body.style.opacity = 'initial';
  }

  function parsePhoto(arrayBuffer) {
    var byteArray = new Uint8Array(arrayBuffer);
    var string = String.fromCharCode.apply(null, byteArray);
    var dataUri = 'data:image/jpeg;base64,' + btoa(string);
    return dataUri;
  }

  function parseCookies() {
    if(document.cookie == '') return {};
    var arr = document.cookie.split(/;\s/);
    var result = {};
    for(var i=0; i<arr.length; i++) {
      let key = arr[i].match(/.+?(?==)/)[0];
      let value = arr[i].slice(key.length + 1);
      result[key] = value;
    }
    return result;
  }

  $scope.services = {

    background: {

      google: function() {
        var url = parseCookies().bg;
        if(url) return setBackgroundImage(url);
        $http({
          method: 'GET',
          url: 'https://clients3.google.com/cast/chromecast/home'
        }).then(function(res) {
          var match = res.data.match(/JSON\.parse\('.+'\)(?=\)\.)/)[0];
          var urls = eval(match);
          var index = Math.round(Math.random() * (urls[0].length - 1));
          url = urls[0][index][0];
          setBackgroundImage(url);
          document.cookie = 'bg=' + url + '; expires=' + new Date(Date.now() + 2*60*60*1000).toUTCString();
        }).
        catch (function(res) {
          $scope.services.background.local()
        })
      },

      custom: function(opts) {
        chrome.cookies.get({
          "url": opts.url,
          "name": "root-jwt"
        }, function(cookie) {
          if (!cookie) {
            $scope.showMsg = 'go to ' + opts.url;
            $scope.url = opts.url;
          }

          // get background url for today
          $http({
            method: 'POST',
            url: opts.url + '/api/backgroundImage/example/imagesForMonth',
            headers: {
              'Authorization': 'Bearer ' + cookie.value,
              'Content-Type': 'application/json;charset=UTF-8'
            },
            data: {
              month: new Date().getMonth()
            }
          }).then(function(res) {
            for (var n in res.data) {
              let imgDate = new Date(res.data[n].forDate).setHours(0, 0, 0, 0);
              let today = new Date().setHours(0, 0, 0, 0);
              if (imgDate == today) {
                document.body.style.background = 'url("http://bg.hrm.demo.linnovate.net' + res.data[n].src + '") 0% 0% / cover rgb(220,220,220)';
                document.body.style.opacity = 'initial';
              }
            }
          }).catch(function(res) {
            $scope.services.background.local()
          })
        });
      },

      local: function() {
        document.body.style.background = 'url("../images/dd_20141001_7212_master.jpg") 0% 0% / cover rgb(220,220,220)';
        document.body.style.opacity = 'initial';
      }
    },


    profile: {

      google: function(token) {
        $http({
          method: 'GET',
          url: 'https://content.googleapis.com/plus/v1/people/me',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }).then(function(res) {
          $rootScope.profile = {
            name: res.data.name.givenName,
            image: res.data.image.url
          }
        })
      },

      custom: function(opts) {
        chrome.cookies.get({
          "url": opts.url,
          "name": "root-jwt"
        }, function(cookie) {
          if (!cookie) {
            $scope.showMsg = 'go to ' + opts.url;
            $scope.url = opts.url;
          }

          $http({
            method: 'GET',
            url: opts.url + '/api/users/me',
            headers: {
              'Authorization': 'Bearer ' + cookie.value
            }
          }).then(function(res) {
            $rootScope.profile = {
              name: res.data.name,
              image: res.data.profile.avatar
            }

          }).catch(function(res) {
            console.log(res)
          })
        });
      }
    },


    meetings: {

      google: function(token) {
        $http({
          method: 'GET',
          url: 'https://content.googleapis.com/calendar/v3/calendars/primary/events',
          params: {
            timeMin: new Date().toISOString(), // (1465654232773)
            timeMax: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(), // end of day
            singleEvents: true,
            showDeleted: false,
            orderBy: 'startTime',
            maxResults: 7
          },
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }).then(function(res) {
          $scope.tabs.meetings.items = res.data.items;
          $scope.attendees = {};
          for (var i = 0; i < res.data.items.length; i++) {
            if (!res.data.items[i].attendees) continue;
            for (var j = 0; j < res.data.items[i].attendees.length; j++) {
              if (res.data.items[i].attendees[j].self) { // remove self from attendees array
                res.data.items[i].attendees.splice(j, 1);
                j--;
                continue;
              }
              let email = res.data.items[i].attendees[j].email;
              $scope.attendees[email] = res.data.items[i].attendees[j];
            }
          }

          Object.keys($scope.attendees).forEach(function(email) {
            let attendee = $scope.attendees[email]
            $http({
              method: 'GET',
              url: 'https://www.google.com/m8/feeds/contacts/default/full',
              headers: {
                'Authorization': 'Bearer ' + token,
                'GData-Version': '3.0'
              },
              params: {
                alt: 'json',
                q: email,
                'max-results': 1000
              }
            }).then(function(res) {
              if (!res.data.feed.entry) return;
              attendee.title = res.data.feed.entry[0].title.$t;
              $http({
                method: 'GET',
                url: res.data.feed.entry[0].link[0].href,
                responseType: 'arraybuffer',
                headers: {
                  'Authorization': 'Bearer ' + token
                },
                params: {
                  sz: 25
                }
              }).then(function(res) {
                attendee.photo = parsePhoto(res.data);
              })
            }).catch(function(res) {
              console.log(res)
            })
          })
        })
      },

      custom: function() {
        console.log('executed meetings custom function')
      }

    },


    "projects & tasks": {

      google: function() {
        console.log('executed projects google function')
      },

      custom: function(opts) {
        chrome.cookies.get({
          "url": opts.url,
          "name": "root-jwt"
        }, function(cookie) {
          if (!cookie) {
            $scope.showMsg = 'go to ' + opts.url;
            $scope.url = opts.url;
          }

          $http({
            method: 'GET',
            url: opts.url + '/api/projects',
            params: {
              start: 0,
              limit: 0,
              sort: 'created'
            },
            headers: {
              'Authorization': 'Bearer ' + cookie.value
            }
          }).then(function(res) {
            $scope.tabs.projects.items = res.data.content;

            $scope.users = $scope.users || {};

            res.data.content.forEach(function(p) {
              $scope.users[p.creator] = {};
            });
            // usersSource.projects = true;
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
              'Authorization': 'Bearer ' + cookie.value
            }
          }).then(function(res) {
            $scope.tabs.tasks.items = res.data.content.filter((item) => {
              return  item.title;
            });
            $scope.tabs.tasks.items.forEach(function(el) {
              if(new Date(el.due)&&new Date(el.due) < new Date)
              el.past=true;  
             });

            $scope.users = $scope.users || {};

            res.data.content.forEach(function(t) {
              $scope.users[t.creator] = {};
            });
            // usersSource.tasks = true;
          }).catch(function(res) {
            console.log(res)
          })
        });

      }
    }
  }



  $scope.googleAuth = function(services) {
    for (var n in services) {
      if ($scope.services[services[n]].google.toString().slice(9, 11) == '()') {
        $scope.services[services[n]].google()
        services.splice(n, 1)
      }
    }
    chrome.identity.getAuthToken({
      interactive: true
    }, function(token) {
      if (!token) return console.error('Error: login to Google failed');
      chrome.identity.removeCachedAuthToken({
        token: token
      })
      for (var n in services) {
        $scope.services[services[n]].google(token);
      }
    })
  }

};
