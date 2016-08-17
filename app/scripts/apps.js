'use strict';

app.apps = function($scope) {
  $scope.apps = {
    gmail: {
      class: 'google gmail',
      link: 'https://mail.google.com/'
    },
    calendar: {
      class: 'google calendar',
      link: 'https://calendar.google.com/'
    },
    search: {
      class: 'google search',
      link: 'https://www.google.com/'
    },
    drive: {
      class: 'google drive',
      link: 'https://drive.google.com/'
    },
    facebook: {
      class: 'facebook',
      link: 'https://www.facebook.com/'
    },
    twitter: {
      class: 'twitter',
      link: 'https://twitter.com/'
    }
    /*,
    youtube: {
      class: 'google youtube',
      link: 'https://www.youtube.com/'
    }*/
  }
}