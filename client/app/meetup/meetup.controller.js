'use strict';

angular.module('sntdApp')
  .controller('MeetupCtrl', function ($scope, $http) {
    $scope.meetup = {};

    $http.get("/api/meetups/create").success(function(meetup) {
      $scope.meetup = meetup;
    });
  });
