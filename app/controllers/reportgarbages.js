var mongoose = require('mongoose'),
    ReportGarbage = mongoose.model('ReportGarbage'),
    City = mongoose.model('City');


exports.create = function(req, res){
	if(!req.body.address || !req.body.lat || !req.body.lng || !req.body.city){
		if(!req.body.address){
			res.send({status:0,message:"ReportGarbage address required"});
		}else if(!req.body.lng){
			res.send({status:0,message:"ReportGarbage longitude required"});
		}else if(!req.body.lat){
			res.send({status:0,message:"ReportGarbage latitude required"});
		}else if(!req.body.city){
			res.send({status:0,message:"ReportGarbage City required"});
		}
	}else{
		ReportGarbage.findOne({lat:req.body.lat, lng:req.body.lng, deleted:0}).exec(function(err,dump){
			if(dump){
				res.send({status:0,message:"ReportGarbage of same location already exists"})
			}else{
				ReportGarbage(req.body).save(function(err, ReportGarbage){
					if(err){
						res.send({status:0,message:err});
					}else{
				//		res.send({status:1,message:"success",data:ReportGarbage});
                        req.query.city = req.body.city;
                        exports.fetch(req,res);
						City.findOne({_id:req.body.city}).exec(function(err,city){
							if(!err){
								if(!city.ReportGarbages){
									city.ReportGarbages=[];							
								}
								city.ReportGarbages.push(ReportGarbage._id);
								city.save();
							}
						})				
					}
				})
                
			}
		})		
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
		ReportGarbage.findOne({lat:req.body.lat, long:req.body.long, _id:{$ne:req.params.id}}).exec(function(err,dump){
			if(dump.length){
				res.send({status:0,message:"ReportGarbage of same location already exists"})
			}else{
				ReportGarbage.findOneAndUpdate({_id:req.params.id},update,{upsert:false,multi:false},function(err){
					if(err){
						res.send({status:0,message:err});
					}else{
						res.send({status:1,message:"success"});
					}
				})
			}
		})		
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
	ReportGarbage.find(query,function(err, ReportGarbage){
		if(err){
			res.send({status:0,message:err});
		}else{
			if(!ReportGarbage.length){
				res.send({status:0,message:"No ReportGarbages Found",data:ReportGarbage});
			}else{
				res.send({status:1,message:"success",data:ReportGarbage});
			}			
		}
	})
}


exports.delete = function(req, res){
	if(req.params.ReportGarbageId){
		ReportGarbage.findOneAndUpdate({_id:req.params.ReportGarbageId},{deleted:1},{multi:false,upsert:false},function(err,ReportGarbage){
			if(err){
				res.send({status:0,message:err});
			}else{
				res.send({status:1,message:"success"});
			}
		})
	}else{
		res.send({status:0,message:"ReportGarbage Id required"});
	}	
}