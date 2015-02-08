'use strict';

angular.module('sntdApp')
  .controller('MeetupCtrl', function ($scope, $http, Meetup) {
    $scope.meetup = {};
    $scope.errors = {};

    $http.get("/api/meetups/create").success(function(meetup) {
      $scope.meetup = meetup;
    });

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Meetup.createMeetup({
          name: $scope.user.name,
          email: $scope.user.email,
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
