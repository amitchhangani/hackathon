var mongoose = require('mongoose'),
	CollectionCenter = mongoose.model('CollectionCenter'),
	User = mongoose.model('User');


exports.create = function (req, res) {
	if (!req.body.name || !req.body.role || (!req.body.vehicleId && !req.body.collectionCenter)) {
		if (!req.body.name) {
			res.send({ status: 0, message: "User name required" });
		} else if (!req.body.role) {
			res.send({ status: 0, message: "User role required" });
		} else if (!req.body.vehicleId && !req.body.collectionCenter) {
			res.send({ status: 0, message: "User can either be a Sweeper or Driver" });
		}
	} else {
		User(req.body).save().then(function (userData) {
			if (!userData) {
				res.send({ status: 0, message: "User not created" });
			}
			//res.send({status:1, message:"success", data:user});
			if (req.body.role != "Driver") {
				CollectionCenter.findOne({ _id: req.body.collectionCenter }).then(function (collectionCenter) {
					if (!collectionCenter.users) {
						city.users = [];
					}
					collectionCenter.users.push(collectionCenter._id);
					collectionCenter.save().then(function (err) {
						if (!err) {
							res.send({ status: 1, message: "success" });
						} else {
							res.send({ status: 0, message: err });
						}
					});
				}).catch(function (err) {
					res.send({ status: 0, message: err });
				});
			} else {
				res.send({ status: 1, message: "success", data: userData });
			}
		}).catch(function (err) {
			res.send({ status: 0, message: err.message || err });
		});
	}
}

exports.fetch = function (req, res) {
	User.find().populate('vehicleId').then(function (userData) {
		if (!userData) {
			res.send({ status: 0, message: "No User Found", data: userData });
		} else {
			res.send({ status: 1, message: "success", data: userData });
		}
	}).catch(function (err) {
		res.send({ status: 0, message: err.message || err });
	});
}