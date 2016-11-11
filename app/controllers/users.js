var mongoose = require('mongoose'),
    User = mongoose.model('User');


exports.create = function(req, res){
	if(!req.body.name || !req.body.role || !req.body.vehicleId){
		if(!req.body.name){
			res.send({status:0, message:"User name required"});
		}else if(!req.body.role){
			res.send({status:0, message:"User role required"});
		}else if(!req.body.vehicleId){
			res.send({status:0, message:"User capacity required"});
		}
	}else{
		User(req.body).save(function(err, user){
			if(err){
				res.send({status:0, message:err});
			}else{
				res.send({status:1, message:"success", data:user});
			}
		});
	}
}

exports.fetch = function(req, res){
	User.find().populate('vehicleId').exec(function(err, userData){
		if(err){
			res.send({status:0,message:err});
		}else{
			if(!userData){
				res.send({status:0, message:"No User Found", data:userData});
			}else{
				res.send({status:1, message:"success", data:userData});
			}			
		}
	});
}