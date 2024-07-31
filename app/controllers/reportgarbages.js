var mongoose = require('mongoose'),
	ReportGarbage = mongoose.model('ReportGarbage'),
	City = mongoose.model('City');


exports.create = function (req, res) {
	if (!req.body.address || !req.body.lat || !req.body.lng || !req.body.city) {
		if (!req.body.address) {
			res.send({ status: 0, message: "ReportGarbage address required" });
		} else if (!req.body.lng) {
			res.send({ status: 0, message: "ReportGarbage longitude required" });
		} else if (!req.body.lat) {
			res.send({ status: 0, message: "ReportGarbage latitude required" });
		} else if (!req.body.city) {
			res.send({ status: 0, message: "ReportGarbage City required" });
		}
	} else {
		ReportGarbage.findOne({ lat: req.body.lat, lng: req.body.lng, deleted: 0 }).then(function (dump) {
			if (dump) {
				res.send({ status: 1, message: "ReportGarbage of same location already exists" })
			} else {
				ReportGarbage(req.body).save().then(function (reportGarbage) {
					//		res.send({status:1,message:"success",data:reportGarbage});
					req.query.city = req.body.city;
					exports.fetch(req, res);
					City.findOne({ _id: req.body.city }).then(function (city) {
						if (!city.ReportGarbages) {
							city.ReportGarbages = [];
						}
						city.ReportGarbages.push(reportGarbage._id);
						city.save();
					})
				}).catch(function (err) {
					res.send({ status: 0, message: err.message || err });
				});

			}
		}).catch(function (err) {
			res.send({ status: 0, message: err.message || err });
		});
	}
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
		ReportGarbage.findOne({ lat: req.body.lat, long: req.body.long, _id: { $ne: req.params.id } }).then(function (dump) {
			if (dump.length) {
				res.send({ status: 0, message: "ReportGarbage of same location already exists" })
			} else {
				ReportGarbage.findOneAndUpdate({ _id: req.params.id }, update, { upsert: false, multi: false }).then(function (reportGarbage) {
					if (!reportGarbage) {
						res.send({ status: 0, message: 'No ReportGarbage found' });
					} else {
						res.send({ status: 1, message: "success" });
					}
				}).catch(function (err) {
					res.send({ status: 0, message: err.message || err });
				});
			}
		}).catch(function (err) {
			res.send({ status: 0, message: err.message || err });
		});
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
	ReportGarbage.find(query).then(function (reportGarbage) {
		if (!reportGarbage.length) {
			res.send({ status: 0, message: "No ReportGarbages Found", data: reportGarbage });
		} else {
			res.send({ status: 1, message: "success", data: reportGarbage });
		}
	}).catch(function (err) {
		res.send({ status: 0, message: err.message || err });
	});
}


exports.delete = function (req, res) {
	if (req.params.ReportGarbageId) {
		ReportGarbage.findOneAndUpdate({ _id: req.params.ReportGarbageId }, { deleted: 1 }, { multi: false, upsert: false }).then(function (reportGarbage) {
			if (!reportGarbage) {
				res.send({ status: 0, message: "No ReportGarbage found" });
			} else {
				res.send({ status: 1, message: "success" });
			}
		}).catch(function (err) {
			res.send({ status: 0, message: err.message || err });
		});
	} else {
		res.send({ status: 0, message: "ReportGarbage Id required" });
	}
}