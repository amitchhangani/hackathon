var mongoose = require('mongoose'),
    DumpYard = mongoose.model('DumpYard'),
    City = mongoose.model('City');


exports.create = function(req, res){
	if(!req.body.name || !req.body.lat || !req.body.long || !req.body.city){
		if(!req.body.name){
			res.send({status:0,message:"DumpYard name required"});
		}else if(!req.body.long){
			res.send({status:0,message:"DumpYard longitude required"});
		}else if(!req.body.lat){
			res.send({status:0,message:"DumpYard latitude required"});
		}else if(!req.body.city){
			res.send({status:0,message:"DumpYard City required"});
		}
	}else{
		DumpYard.findOne({lat:req.body.lat, long:req.body.long,deleted:0}).then(function(dump){
			if(dump){
				res.send({status:0,message:"DumpYard of same location already exists"})
			}else{
				DumpYard(req.body).save().then(function(dumpYard){
				//		res.send({status:1,message:"success",data:dumpYard});
					req.query.city = req.body.city;
					exports.fetch(req,res);
					City.findOne({_id:req.body.city}).then(function(city){
						if(!city.dumpYards){
							city.dumpYards=[];							
						}
						city.dumpYards.push(dumpYard._id);
						city.save();
					}).catch(function(err){
						res.send({status:0,message:err});
					});		
				})
                
			}
		}).catch(function(err){
			res.send({status:0,message:err.message || err});
		});		
	}
}

exports.edit = function(req, res){
	if(!req.body.name && !req.body.lat && !req.body.long && !req.body.city){
		res.send({status:0,message:"Nothing to Update"})
	}else{
		var update={};
		if(req.body.name){
			update.name=req.body.name;
		}
		if(req.body.long){
			update.long=req.body.long;
		}
		if(req.body.lat){
			update.lat=req.body.lat;
		}
		if(req.body.city){
			update.city=req.body.city;			
		}
		DumpYard.findOne({lat:req.body.lat, long:req.body.long, _id:{$ne:req.params.id}}).then(function(dump){
			if(dump.length){
				res.send({status:0,message:"DumpYard of same location already exists"})
			}else{
				DumpYard.findOneAndUpdate({_id:req.params.id},update,{upsert:false,multi:false})
				.then(function(dumpYard){
					if(!dumpYard){
						res.send({status:0,message:"No DumpYard found"});
					}else{
						res.send({status:1,message:"success",data:dumpYard});
					}
				}).catch(function(err){
					res.send({status:0,message:err.message || err});
				});
			}
		}).catch(function(err){
			res.send({status:0,message:err.message || err});
		});		
	}
}

exports.fetch = function(req, res){
	var query = {deleted:0};
	if(req.query.city){
		query.city=req.query.city;
	}
	if(req.query.id){
		query._id=req.query.id;
	}
	DumpYard.find(query).then(function(dumpYard){
		if(!dumpYard.length){
			res.send({status:0,message:"No Dumping yards Found",data:dumpYard});
		}else{
			res.send({status:1,message:"success",data:dumpYard});
		}		
	}).catch(function(err){
		res.send({status:0,message:err.message || err});
	});
}


exports.delete = function(req, res){
	if(req.params.dumpYardId){
		DumpYard.findOneAndUpdate({_id:req.params.dumpYardId},{deleted:1},{multi:false,upsert:false}).then(function(dumpYard){
			res.send({status:1,message:"success"});
		}).catch(function(err){
			res.send({status:0,message:err.message || err});
		});
	}else{
		res.send({status:0,message:"DumpYard Id required"});
	}	
}