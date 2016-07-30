var express = require('express');
var app = express();
var port = process.env.port;
var path = require("path");


app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});

app.listen(port, function () {
  console.log('Example app listening on port: ' + port);
});