var express = require('express');
var app = express();
var path = require("path");
var predict = require(path.join(__dirname+'/get_cta_predictions.js'));

var port = process.env.port || 3000;
var myparticleemail = process.env.myparticleemail 
var myparticlepw = process.env.myparticlepw 
var myparticletoken = process.env.myparticletoken

// Set up Photon
var Particle = require("particle-api-js");
var particle = new Particle();
particle.login({ username: myparticleemail, password: myparticlepw });

// Set up a home page / possible place to interface for which buses to watch on what days
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.listen(port, function () {
  console.log('Example app listening on port: ' + port);
});

app.get('/blink', function(req,res){
	particle.publishEvent({ name: 'busalert', data: 'go', auth: myparticletoken })
	.then(
	  function (data) {
	    console.log("Publishing to Photon...");
	  },
	  function (err) {
	  	console.log("Failed to publish event. :(");
	  }
	);
});

// Use CTA API and send to Photon
function getBusTime() {
	predict().then(function(minutes) {
		var data;

		if(minutes >= 4 && minutes <= 10) {
			data = "go";
		} else {
			data = "stop";
		}

		particle.publishEvent({ name: 'busalert', data: data, auth: myparticletoken })
		.then(
		  function (data) {
		    console.log("Publishing to Photon...");
		  },
		  function (err) {
		  	console.log("Failed to publish event. :(");
		  }
		);
	})
}

//getBusTime();
//setInterval(getBusTime, (10 * 1000))
