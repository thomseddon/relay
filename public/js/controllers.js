'use strict';

/* Controllers */

app.controllers = angular.module('relay.controllers', [])

app.controllers.run(['$rootScope', '$location',
    function ($rootScope, $location) {
  $rootScope.location = $location;
}])

app.controllers.controller('Sms', ['$scope', 'ws', 'contacts', 'sms',
    'threadFilter', function ($scope, ws, contacts, sms, threadFilter) {

  $scope.contacts = contacts;
  $scope.smss = sms;
  $scope.threads = threadFilter(sms);
  $scope.thread = null;

  $scope.selectThread = function (thread) {
    $scope.thread = thread;
    $scope.scrollConvo();
  }

  $scope.sendText = function (text) {
    ws.send('client:sendText', {
      address: $scope.thread.address,
      body: text
    });

    var _sms = {
      address: $scope.thread.address,
      body: text,
      date: (+new Date()) / 1000,
      threadId: $scope.thread.id,
      type: 2
    };

    // Add to model
    sms.data.push(_sms);
    $scope.threads = threadFilter(sms.data);
    $scope.thread.sms.push(_sms);
    $scope.scrollConvo();

    // Clear text
    $scope.text = '';
  };

  $scope.$watchCollection(function () {
    return sms.data;
  }, function (value, old) {
    console.log('smss updated (collection)');
    $scope.threads = threadFilter(sms.data);

    if (!$scope.thread && $scope.threads && $scope.threads.length)
      $scope.selectThread($scope.threads[0]);
  });

  $scope.scrollConvo = function () {
    setTimeout(function () {
      // Start At bottom
      var ul = document.querySelector('#conversation ul');
      if (ul)
        ul.scrollTop = ul.scrollHeight;
    }, 0);
  };

}]);
