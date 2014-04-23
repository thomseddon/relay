
/**
 * Module dependencies
 */

var less = require('less-middleware');
var express = require('express');
var mdns = require('mdns2');
var http = require('http');
var ws = require('ws');

/**
 * Express
 */

var app = express();

app.use(less(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));

/**
 * HTTP Server
 */

var server = http.createServer(app);

/**
 * multicast DNS Advertisement
 */

mdns.createAdvertisement(mdns.tcp('relay'), 5283).start();

/**
 * Web socket
 */

var wss = new ws.Server({ server: server });
var sockets = [];

wss.on('connection', function (ws) {

  console.log('Got a connection');
  sockets.push(ws);

  ws.on('message', function (message) {
    console.log('recieved:', message);

    // Fan out
    sockets.forEach(function (socket) {
      if (socket.readyState === socket.OPEN)
        socket.send(message);
    });
  });

  ws.on('close', function () {
    console.log('connection closed');
  });
});

/**
 * Fire up
 *
 * sudo firewall-cmd --add-port=5283/tcp
 * sudo firewall-cmd --permanent --add-port=5283/tcp
 */

server.listen(5283);
