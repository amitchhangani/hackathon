var mongoose = require('mongoose'),
    CollectionCenter = mongoose.model('CollectionCenter'),
    User = mongoose.model('User');


exports.create = function(req, res){
	if(!req.body.name || !req.body.role || !req.body.vehicleId){
		if(!req.body.name){
			res.send({status:0, message:"User name required"});
		}else if(!req.body.role){
			res.send({status:0, message:"User role required"});
		}else if(!req.body.vehicleId && !req.body.collectionCenter){
			res.send({status:0, message:"User can either be a Sweeper or Driver"});
		}
	}else{
		User(req.body).save(function(err, user){
			if(err){
				res.send({status:0, message:err});
			}else{
				//res.send({status:1, message:"success", data:user});
				if(req.body.role!="Driver"){
					CollectionCenter.findOne({_id:req.body.collectionCenter}).exec(function(err,collectionCenter){
						if(!err){
							if(!collectionCenter.users){
								city.users=[];							
							}
							collectionCenter.users.push(collectionCenter._id);
							collectionCenter.save(function(err){
								if(!err){
									res.send({status:1, message:"success"});
								}else{
									res.send({status:0, message:err});
								}
							});
						}
					})	
				}else{
					res.send({status:1, message:"success", data:userData});
				}
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