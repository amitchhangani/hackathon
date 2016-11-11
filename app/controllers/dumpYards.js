var mongoose = require('mongoose'),
    DumpYard = mongoose.model('DumpYard');


exports.create = function(req, res){
	if(!req.body.name || !req.body.latlong){
		if(!req.body.name){
			res.send({status:0,message:"City name required"});
		}else if(!req.body.latlong){
			res.send({status:0,message:"City latlong required"});
		}
	}else{
		req.body.deleted=0;
		DumpYard(req.body).save(function(err){
			if(err){
				res.send({status:0,message:err});
			}else{
				res.send({status:1,message:"success"});
			}
		})
	}
}

exports.fetch = function(req, res){
	DumpYard.findOne({deleted:0},function(err,dumpYard){
		if(err){
			res.send({status:0,message:err});
		}else{
			res.send({status:1,message:"success",data:dumpYard});
		}
	})
}


exports.delete = function(req, res){
	if(req.params.dumpYardId){
		DumpYard.findOneAndUpdate({deleted:1},{},function(err,dumpYard){
			if(err){
				res.send({status:0,message:err});
			}else{
				res.send({status:1,message:"success",data:dumpYard});
			}
		})
	}else{
		res.send({status:0,message:"DumpYard Id required"});
	}	
}