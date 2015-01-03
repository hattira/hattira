'use strict';

angular.module('sntdApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('meetup', {
        url: '/meetups/create',
        templateUrl: 'app/meetup/meetup.html',
        controller: 'MeetupCtrl'
      });
  });
