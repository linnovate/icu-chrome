'use strict';

app.apps = function($scope) {
  $scope.availableApps = [
    {
      class: 'gmail',
      link: 'https://mail.google.com/'
    },
    {
      class: 'calendar',
      link: 'https://calendar.google.com/'
    },
    {
      class: 'search',
      link: 'https://www.google.com/'
    },
    {
      class: 'drive',
      link: 'https://drive.google.com/'
    },
    {
      class: 'facebook',
      link: 'https://www.facebook.com/'
    },
    {
      class: 'twitter',
      link: 'https://twitter.com/'
    },
    {
      class: 'linkedin',
      link: 'https://www.linkedin.com/'
    },
    {
      class: 'waze',
      link: 'https://www.waze.com/'
    }
  ]
}