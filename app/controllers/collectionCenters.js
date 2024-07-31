var mongoose = require('mongoose'),
	CollectionCenter = mongoose.model('CollectionCenter'),
	City = mongoose.model('City'),
	ReportGarbage = mongoose.model('ReportGarbage'),
	Vehicle = mongoose.model('Vehicle');


exports.create = function (req, res) {
	if (!req.body.name || !req.body.lat || !req.body.long || !req.body.city) {
		if (!req.body.name) {
			res.send({ status: 0, message: "Collection Center name required" });
		} else if (!req.body.long) {
			res.send({ status: 0, message: "Collection Center longitude required" });
		} else if (!req.body.lat) {
			res.send({ status: 0, message: "Collection Center latitude required" });
		} else if (!req.body.city) {
			res.send({ status: 0, message: "Collection Center City required" });
		} else if (!req.body.vehicle) {
			res.send({ status: 0, message: "Collection Center vehicle required" });
		} else if (!req.body.sweeperCapacity) {
			res.send({ status: 0, message: "Collection Center Sweeper Capacity required" });
		}
	} else {
		CollectionCenter.findOne({ lat: req.body.lat, long: req.body.long, deleted: 0 }).then(function (col) {
			if (col.length > 0) {
				res.send({ status: 0, message: "CollectionCenter of same location already exists" });
			}
			CollectionCenter(req.body).save().then(function (collectionCenter) {
				if (!collectionCenter) {
					res.send({ status: 0, message: "Collection Center not created" });
				} else {
					res.send({ status: 1, message: "success", data: collectionCenter });
					if (req.body.reportCase && req.body.clientId) {
						ReportGarbage.update({ _id: req.body.clientId }, { $set: { deleted: 1 } }).then(function (modData) {
							console.log(modData)
						}).catch(function (err) {
							console.log(err)
						});
					}
					City.findOne({ _id: req.body.city }).then(function (city) {
						if (city) {
							if (!city.collectionCenters) {
								city.collectionCenters = [];
							}
							city.collectionCenters.push(collectionCenter._id);
							city.save().then(function (cityData) {
								Vehicle.findOne({ _id: req.body.vehicle }).then(function (vehicle) {
									if (vehicle) {
										if (!vehicle.collectionCenters) {
											vehicle.collectionCenters = [];
										}
										if (vehicle.collectionCenters.indexOf(collectionCenter._id) == -1) {
											vehicle.collectionCenters.push(collectionCenter._id);
											vehicle.save();
										}
									}
								}).catch(function (err) {
									res.send({ status: 0, message: err.message || err });
								});
							}).catch(function (err) {
								res.send({ status: 0, message: err.message || err });
							});
						} else {
							res.send({ status: 0, message: "City not found" });
						}
					}).catch(function (err) {
						res.send({ status: 0, message: err });
					});
				}
			}).catch(function (err) {
				res.send({ status: 0, message: err.message || err });
			});
		})
	}
}

exports.fetch = function (req, res) {
	var query = { deleted: 0 };
	if (req.query.city) {
		query.city = req.query.city;
	}
	if (req.query.id) {
		query._id = req.query.id;
	}
	if (req.query.vehicleId) {
		query.vehicle = req.query.vehicleId;
	}

	CollectionCenter.find(query).then(function (collectionCenter) {
		if (!collectionCenter.length) {
			res.send({ status: 0, message: "No Collection Centers Found", data: collectionCenter });
		} else {
			res.send({ status: 1, message: "success", data: collectionCenter });
		}
	}).catch(function (err) {
		res.send({ status: 0, message: err.message || err });
	});
}


exports.edit = function (req, res) {
	if (!req.body.name && !req.body.lat && !req.body.long && !req.body.city) {
		res.send({ status: 0, message: "Nothing to Update" })
	} else {
		var update = {};
		if (req.body.name) {
			update.name = req.body.name;
		}
		if (req.body.long) {
			update.long = req.body.long;
		}
		if (req.body.lat) {
			update.lat = req.body.lat;
		}
		if (req.body.city) {
			update.city = req.body.city;
		}
		if (req.body.vehicle) {
			update.vehicle = req.body.vehicle;
		}
		if (req.body.sweeperCapacity) {
			update.sweeperCapacity = req.body.sweeperCapacity;
		}
		CollectionCenter.findOne({ lat: req.body.lat, long: req.body.long, _id: { $ne: req.params.id } }).then(function (col) {
			if (col.length) {
				res.send({ status: 0, message: "CollectionCenter of same location already exists" })
			} else {
				CollectionCenter.findOneAndUpdate({ _id: req.params.id }, update, { upsert: false, multi: false }).then(function (collectionCenter) {
					if (!collectionCenter) {
						res.send({ status: 0, message: "No CollectionCenter found" });
					} else {
						res.send({ status: 1, message: "success" });
					}
				}).catch(function (err) {
					res.send({ status: 0, message: err.message || err });
				});
			}
		})
	}
}


exports.delete = function (req, res) {
	if (req.params.collectionCenterId) {
		CollectionCenter.findOneAndUpdate({ _id: req.params.collectionCenterId }, { deleted: 1 }, { multi: false, upsert: false }).then(function (collectionCenter) {
			if (!collectionCenter) {
				res.send({ status: 0, message: "No CollectionCenter found" });
			} else {
				res.send({ status: 1, message: "success" });
			}
		}).catch(function (err) {
			res.send({ status: 0, message: err.message || err });
		});
	} else {
		res.send({ status: 0, message: "Collection Center Id required" });
	}
}