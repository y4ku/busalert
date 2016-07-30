var predict = require('./get_cta_predictions.js');

function getBusTime() {
	predict().then(function(minutes) {
		var data;
		console.log(minutes);
		if(minutes >= 5) {
			data = "go";
		} else {
			data = "stop";
		}

		console.log(data);
		/*
		particle.publishEvent({ name: 'busalert', data: data, auth: myparticletoken })
		.then(
		  function (data) {
		    console.log("Publishing to Photon...");
		  },
		  function (err) {
		  	console.log("Failed to publish event. :(");
		  }
		);*/
	})
}

setInterval(getBusTime, (10 * 1000))