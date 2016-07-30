var http = require("http");
var querystring = require("querystring");
var fetch = require("node-fetch");
var parseString = require("xml2js").parseString;
var moment = require('moment');



// #################################
// Variables to Modify
var busApiKey = process.env.CTA_BUS_API_KEY;
var busNumber = 66
var direction = "Westbound"
var stopname = "Chicago & Michigan"
// #################################


function get(options) {
	return fetch(this.url + "?" + querystring.stringify(options), {
		method: 'get'
	}).then(function(response) {
		return response.text();
	}).then(function(xml) {
		return xml;
	}).catch(function(err) {
		console.log("Error: " + err.message);
	})
}

function parseStringPromise(xml) {
	return new Promise(function(resolve, reject) {
		parseString(xml, function(err, result) {
			if(err) {
				reject(err)
			}
			else {
				resolve(result)
			}
		})
	})
}

// CTA API
var CtaNode = {
  bus: {
	  time: {
	    url: "http://www.ctabustracker.com/bustime/api/v1/gettime",
	    get: get
	  },
	  vehicles: {
	    url: "http://www.ctabustracker.com/bustime/api/v1/getvehicles",
	    get: get
	  },
	  routes: {
	    url: "http://www.ctabustracker.com/bustime/api/v1/getroutes",
	    get: get
	  },
	  directions: {
	    url: "http://www.ctabustracker.com/bustime/api/v1/getdirections",
	    get: get
	  },
	  stops: {
	    url: "http://www.ctabustracker.com/bustime/api/v1/getstops",
	    get: get
	  },
	  patterns: {
	    url: "http://www.ctabustracker.com/bustime/api/v1/getpatterns",
	    get: get
	  },
	  predictions: {
	    url: "http://www.ctabustracker.com/bustime/api/v1/getpredictions",
	    get: get
	  },
	  bulletins: {
	    url: "http://www.ctabustracker.com/bustime/api/v1/getservicebulletins",
	    get: get
	  }
	}
}

// Get Stop ID Number and  Prediction for that stop for a specific bus number
module.exports = function() {
	return CtaNode.bus.stops.get({ key: busApiKey, rt: busNumber, dir: direction })
	.then(parseStringPromise)
	.then(function(json) {
		var bus_stops = json["bustime-response"]["stop"];

		for (stop in bus_stops) {
			if (bus_stops[stop]['stpnm'] == stopname) {
				var stop_id = bus_stops[stop]['stpid']
				return stop_id
			}
		}
	})
	.then(function(stop_id) {
		// use CTA Predict API Function
		return CtaNode.bus.predictions.get({ key: busApiKey, rt: busNumber, stpid: stop_id, top:1 })	
	})
	.then(parseStringPromise)
	.then(function(prediction_json) {
		// Assuming only one -- still need to check if the first object is the most recent one
		var now = prediction_json["bustime-response"]["prd"][0]["tmstmp"];
		var arrive = prediction_json["bustime-response"]["prd"][0]["prdtm"];
		var now_formatted = moment(now, "YYYYMMDD HH:mm");
		var arrive_formatted = moment(arrive, "YYYYMMDD HH:mm");
		time_till_bus = arrive_formatted.diff(now_formatted, 'minutes');
		console.log("Next "+ busNumber.toString() + " Bus in " + time_till_bus.toString() + " minutes")
		return time_till_bus
	})
}


