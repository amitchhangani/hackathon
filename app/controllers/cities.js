var mongoose = require('mongoose'),
    City = mongoose.model('City');


exports.create = function(req, res){
	if(!req.body.name || !req.body.long || !req.body.lat){
		if(!req.body.name){
			res.send({status:0,message:"City name required"});
		}else if(!req.body.long){
			res.send({status:0,message:"City longitude required"});
		}else if(!req.body.lat){
			res.send({status:0,message:"City latitude required"});
		}
	}else{
		City(req.body).save(function(err){
			if(err){
				res.send({status:0,message:err});
			}else{
				res.send({status:1,message:"success"});
			}
		})
	}
}

exports.fetch = function(req, res){
	City.findOne({},function(err,city){
		if(err){
			res.send({status:0,message:err});
		}else{
			res.send({status:1,message:"success",data:city});
		}
	})
}