'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
app.services = angular.module('relay.services', []);

app.services.value('version', '0.1');

app.services.factory('ws', ['$rootScope', function ($rootScope) {
  var ws = {};
  var handlers = {};
  var sendQueue = [];
  var connected = false;

  // Setup socket
  var socket = new WebSocket('ws://127.0.0.1:5283');

  socket.onmessage = function (event) {
    var pos = event.data.indexOf(' ');
    var name = event.data.substr(0, pos);
    console.log('Message: ' + name);

    if (handlers[name]) {
      var message = JSON.parse(event.data.substr(pos + 1));

      $rootScope.$apply(function () {
        handlers[name].forEach(function (fn) {
          fn(message);
        });
      });
    }
  };

  socket.onopen = function () {
    // Clear send queue
    connected = true;
    sendQueue.forEach(function (message) {
      socket.send(message);
    });
  };

  // Expose methods
  ws.on = function (name, fn) {
    if (!handlers[name])
      handlers[name] = [];

    handlers[name].push(fn);
  };

  ws.send = function (name, data) {
    var message = name;
    if (data)
      message += ' ' + JSON.stringify(data);

    connected ? socket.send(message) : sendQueue.push(message);
  };

  return ws;
}]);

app.services.factory('contacts', ['$rootScope', 'ws', 'phoneNumberFilter',
    function ($rootScope, ws, phoneNumberFilter) {

  var contacts = {};

  // Watch for all contacts
  ws.on('device:listContacts', function (data) {
    contacts.data = data;
  });

  // There is a high probability this will cause in infinate loop one day :)
  $rootScope.$watchCollection(function () {
    return contacts.data;
  }, function () {
    if (!contacts.data)
      return;

    contacts.data = contacts.data.map(function (contact) {
      // Ensure proper phone number
      contact.number = phoneNumberFilter(contact.number);
      return contact;
    });
  });

  // Kick off
  ws.send('client:listContacts');

  return contacts;
}]);

app.services.factory('sms', ['ws', '$rootScope', function (ws, $rootScope) {

  // Service
  var sms = {};

  // Watch for all SMS
  ws.on('device:listSMS', function (data) {
    sms.data = data;
  });

  // Watch for new SMS
  ws.on('device:newSMS', function (data) {
    console.log('NEW SMS');
    sms.data.push(data);
  });

  // Kick off
  ws.send('client:listSMS');

  return sms;
}]);

// TODO
// app.services.factory('db', ['$rootScope', function ($rootScope) {

//   var db;

//   var req = indexDB.open('relay', 1);

//   req.onerror = function () {
//     // ?
//   };

//   req.onsuccess = function (event) {
//     db = req.result;
//   };

//   req.onupgradeneeded = function (event) {

//   };

// }]);
