var predict = require('./get_cta_predictions.js');

function getBusTime() {
	predict().then(function(minutes) {
		var data;
		console.log(minutes);
		if(minutes >= 4) {
			data = "go";
		} else {
			data = "stop";
		}
		console.log(data);
	})
}

getBusTime();