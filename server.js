// import modules
var express = require('express'), // npm install express
  app = express();

var options = {
  timeout: 10000000,
  pool: {
    maxSockets: Infinity
  },
  headers: {
    connection: "keep-alive"
  }
};

//var conf = require("./config").facebook;

// app.get('/pagevis', pagevisExpressHandler.callback);

var port = process.env.PORT || 3000,
  ip = process.env.IP || '140.119.164.22';

app.listen(port, ip, function () {
  console.log("Express server listening on port %d", port);
  console.log("IP : " + ip);
});

app.use(express.static(__dirname + '/public/'));

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});