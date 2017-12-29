var webSocketServer = require('websocket').server;
var http = require('http');

var webSocketsServerPort = 1337;
var server = http.createServer(function(request, response) {});

server.listen(process.env.PORT || webSocketsServerPort, function() {
  console.log((new Date()) + " Websockets is listening on port " + webSocketsServerPort);
});

// Create the WS server
var wsServer = new webSocketServer({
  httpServer: server
});
var clients = [];

wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);
  console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
  clients.push(connection);

  connection.on('message', function(message) {

    if (message.type === 'utf8') {
      var data = JSON.parse(message.utf8Data);
      var response = {
        action: data.action,
        data: data.data
      };

      clients.forEach(function(client) {
        client.sendUTF(JSON.stringify(response));
      });

      // connection.sendUTF(JSON.stringify(response));
    }

  });

});
