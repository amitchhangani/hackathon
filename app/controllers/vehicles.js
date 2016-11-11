var mongoose = require('mongoose'),
    Vehicle = mongoose.model('Vehicle');


exports.create = function(req, res){
	if(!req.body.name || !req.body.type || !req.body.capacity){
		if(!req.body.name){
			res.send({status:0, message:"Vehicle name required"});
		}else if(!req.body.type){
			res.send({status:0, message:"Vehicle type required"});
		}else if(!req.body.capacity){
			res.send({status:0, message:"Vehicle capacity required"});
		}
	}else{
		Vehicle(req.body).save(function(err, vehicle){
			if(err){
				res.send({status:0, message:err});
			}else{
				res.send({status:1, message:"success", data:vehicle});
			}
		});
	}
}

exports.fetch = function(req, res){
	Vehicle.find(function(err, vehicleData){
		if(err){
			res.send({status:0,message:err});
		}else{
			if(!vehicleData){
				res.send({status:0, message:"No Vehicle Found", data:vehicleData});
			}else{
				res.send({status:1, message:"success", data:vehicleData});
			}			
		}
	});
}