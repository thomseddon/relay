'use strict';

/* Filters */

app.filters = angular.module('relay.filters', []);

app.filters.filter('interpolate', ['version', function(version) {
  return function(text) {
    return String(text).replace(/\%VERSION\%/mg, version);
  };
}]);

app.filters.filter('phoneNumber', function () {
  return function (number) {
    return number.replace(/ /g, '').replace(/^0/, '+44');
  }
});

app.filters.filter('smsType', [function () {
  return function (type) {
    switch (type) {
      case 0:
        return 'all';
      case 1:
        return 'inbox';
      case 2:
        return 'sent';
      case 3:
        return 'draft';
      case 4:
        return 'outbox';
      case 5:
        return 'failed';
      case 6:
        return 'queued';
    }
  }
}]);

app.filters.filter('thread', [function () {
  return function (all) {
    if (!all || !all.length)
      return all;

    var threadIds = [];
    var threads = [];

    (all || []).forEach(function (sms) {
      var pos = threadIds.indexOf(sms.threadId);

      if (pos === -1) {
        // Add it
        pos = threadIds.push(sms.threadId) - 1;
        threads.push({
          id: sms.threadId,
          number: sms.address,
          address: sms.address,
          sms: []
        });
      }

      threads[pos].sms.push(sms);
    });

    // console.log(threads)

    return threads;
  }
}]);

app.filters.filter('numberName', ['contacts', function (contacts) {
  return function (number) {
    if (!contacts.data)
      return number;

    for (var i = 0, len = contacts.data.length; i < len; i++) {
      var contact = contacts.data[i];
      if (contact.number === number) {
        return contact.name;
      }
    }

    return number;
  };
}]);
