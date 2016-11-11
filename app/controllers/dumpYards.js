var mongoose = require('mongoose'),
    DumpYard = mongoose.model('DumpYard');


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
		DumpYard(req.body).save(function(err,dumpYard){
			if(err){
				res.send({status:0,message:err});
			}else{
				res.send({status:1,message:"success",data:dumpYard});
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
	DumpYard.find(query,function(err,dumpYard){
		if(err){
			res.send({status:0,message:err});
		}else{
			if(!dumpYard){
				res.send({status:0,message:"No Dumpyards Found",data:dumpYard});
			}else{
				res.send({status:1,message:"success",data:dumpYard});
			}			
		}
	})
}


exports.delete = function(req, res){
	if(req.params.dumpYardId){
		DumpYard.findOneAndUpdate({_id:req.params.dumpYardId},{deleted:1},{multi:false,upsert:false},function(err,dumpYard){
			if(err){
				res.send({status:0,message:err});
			}else{
				res.send({status:1,message:"success"});
			}
		})
	}else{
		res.send({status:0,message:"DumpYard Id required"});
	}	
}