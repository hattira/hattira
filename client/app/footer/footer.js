'use strict';

angular.module('sntdApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('about', {
        url: '/about',
        templateUrl: 'app/footer/about/about.html'
      })
      .state('contact', {
        url: '/contact',
        templateUrl: 'app/footer/contact/contact.html'
      })
  });
