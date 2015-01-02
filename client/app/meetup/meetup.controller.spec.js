'use strict';

describe('Controller: MeetupCtrl', function () {

  // load the controller's module
  beforeEach(module('sntdApp'));

  var MeetupCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MeetupCtrl = $controller('MeetupCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
