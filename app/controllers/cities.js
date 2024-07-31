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
		City(req.body).save().then((city) => {
			res.send({status:1,message:"City created successfully",data:city});
		}).catch((err) => {
			res.send({status:0,message:err});
		});
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
	City.findOne(query).populate("dumpYards",{},{"deleted":0}).populate("collectionCenters",{},{"deleted":0}).then((city) => {
		if(!city){
			return res.send({status:0,message:"No City found",data:city});
		}
		return res.send({status:1,message:"success",data:city});		
	}).catch((err) => {
		res.send({status:0,message:err});
	})
}