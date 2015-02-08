'use strict';

angular.module('sntdApp')
  .factory('Meetup', function Auth($location, $http) {
    return {

      /**
       * Create a new user
       *
       * @param  {Object}   meetup   - meetup info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createMeetup: function(meetup, callback) {
        var cb = callback || angular.noop;

        return
          $http
            .post("/api/meetups/create", meetup)
            .success(function(data) {
              return cb(meetup);
            })
            .error(function(err) {
              return cb(err);
            })
      }
    };
  });
