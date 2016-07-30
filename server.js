var express = require('express');
var app = express();
var port = process.env.port;

app.get('/', function (req, res) {
  res.sendFile('index.html');
});

app.listen(port, function () {
  console.log('Example app listening on port: ' + port);
});