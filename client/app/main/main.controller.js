'use strict';

angular.module('sntdApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.meetups = [];

    $scope.myInterval = 8000;

    $http.get('/api/meetups').success(function(meetups) {
      $scope.meetups = meetups;
    });

    $scope.addMeetup = function() {
      $http.post('/api/meetups', { 
        name: $scope.title
      });
    };

    $scope.deleteMeetup = function(meetup) {
      $http.delete('/api/meetups/' + meetup._id);
    };
  });
