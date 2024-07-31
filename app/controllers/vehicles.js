var mongoose = require('mongoose'),
	Vehicle = mongoose.model('Vehicle'),
	DumpYard = mongoose.model('DumpYard');


exports.create = function (req, res) {
	if (!req.body.name || !req.body.type || !req.body.capacity) {
		if (!req.body.name) {
			res.send({ status: 0, message: "Vehicle name required" });
		} else if (!req.body.type) {
			res.send({ status: 0, message: "Vehicle type required" });
		} else if (!req.body.capacity) {
			res.send({ status: 0, message: "Vehicle capacity required" });
		} else if (!req.body.city) {
			res.send({ status: 0, message: "Vehicle city required" });
		}
	} else {
		Vehicle(req.body).save().then(function (vehicle) {
			if (!vehicle) {
				res.send({ status: 0, message: 'No vehicle found' });
			} else {
				res.send({ status: 1, message: "success", data: vehicle });
			}
		}).catch(function (err) {
			res.send({ status: 0, message: err.message || err });
		});
	}
}

exports.fetch = function (req, res) {
	Vehicle.find().then(function ( vehicleData) {
		if (!vehicleData) {
			res.send({ status: 0, message: "No Vehicle Found", data: vehicleData });
		} else {
			res.send({ status: 1, message: "success", data: vehicleData });
		}
	}).catch(function (err) {
		res.send({ status: 0, message: err.message || err });
	});
}

exports.fetchWithCollection = function (req, res) {
	var collectionCentersFlag = false;
	var query = {};
	if (req.query.vehicleId) {
		query.id = req.query.vehicleId;
	}
	Vehicle.find(query).populate('collectionCenters', { lat: true, long: true, name: true }, { deleted: 0 }).lean().then(function (vehicleData) {

		if (!vehicleData) {
			res.send({ status: 0, message: "No Vehicle Found", data: vehicleData });
		} else {
			DumpYard.find({ deleted: 0 }, { lat: true, long: true, name: true }).lean().then(function (dumpyards) {

				if (dumpyards) {
					for (var i = 0; i < vehicleData.length; i++) {
						vehicleData[i].center = {};
						vehicleData[i].center.lats = 0;
						vehicleData[i].center.longs = 0;
						if (vehicleData[i].collectionCenters) {
							for (var j = 0; j < vehicleData[i].collectionCenters.length; j++) {
								vehicleData[i].center.lats += parseFloat(vehicleData[i].collectionCenters[j].lat);
								vehicleData[i].center.longs += parseFloat(vehicleData[i].collectionCenters[j].long);
							}
							if (vehicleData[i].collectionCenters.length) {
								collectionCentersFlag = true;
								vehicleData[i].center.lats = vehicleData[i].center.lats / vehicleData[i].collectionCenters.length;
								vehicleData[i].center.longs = vehicleData[i].center.longs / vehicleData[i].collectionCenters.length;
								vehicleData[i].dumpyards = findNearestDumpyardsFromAList(vehicleData[i].center, dumpyards)
							} else {
								delete vehicleData[i].center;
							}
						}
					}
					res.send({ status: 1, message: "success", data: vehicleData, collectionCentersFlag: collectionCentersFlag });
				} else {
					res.send({ status: 1, message: "success", data: vehicleData, collectionCentersFlag: collectionCentersFlag });
				}
			}).catch(function (err) {
				res.send({ status: 0, message: err.message || err });
			});
		}
	}).catch(function (err) {
		res.send({ status: 0, message: err.message || err });
	});
}


function findNearestDumpyardsFromAList(center, dumpyards) {
	var distance = [];
	for (var i = 0; i < dumpyards.length; i++) {
		dumpyards[i].distance = getDistanceFromLatLonInKm(center.lats, center.longs, dumpyards[i].lat, dumpyards[i].long)
	}

	dumpyards.sort(function (a, b) {
		return a.distance - b.distance;
	});

	return dumpyards[0];
}

//Calculate Distance between 2 lat/longs using linear programming 
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2 - lat1);  // deg2rad below
	var dLon = deg2rad(lon2 - lon1);
	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2)
		;
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c; // Distance in km
	return d;
}

function deg2rad(deg) {
	return deg * (Math.PI / 180)
}