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
		City(req.body).save(function(err,city){
			if(err){
				res.send({status:0,message:err});
			}else{
				res.send({status:1,message:"success",data:city});
			}
		})
	}
}

exports.fetch = function(req, res){
	var query = {};
	if(req.params.cityId){
		query._id=req.query.cityId;
	}
	if(req.params.cityName){
		query.name=req.query.cityName;
	}
	City.findOne(query).populate("dumpYards",{},{"deleted":0}).populate("collectionCenters",{},{"deleted":0}).exec(function(err,city){
		if(err){
			res.send({status:0,message:err});
		}else{
			if(city){
				res.send({status:1,message:"success",data:city});
			}else{
				res.send({status:0,message:"No City found",data:city});
			}			
		}
	})
}