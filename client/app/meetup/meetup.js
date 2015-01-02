'use strict';

angular.module('sntdApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('meetup', {
        url: '/meetup',
        templateUrl: 'app/meetup/meetup.html',
        controller: 'MeetupCtrl'
      });
  });