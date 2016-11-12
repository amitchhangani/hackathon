var mongoose = require('mongoose'),
    VehicleStat = mongoose.model('VehicleStat'),
    CollectionCenterStat = mongoose.model('CollectionCenterStat'),
    CollectionCenter = mongoose.model('CollectionCenter'),
    Vehicle = mongoose.model('Vehicle');


exports.addRandomData = function(req,res){
	Vehicle.find({}).exec(function(err,vehicle){
		var start_date=new Date(req.query.start);
		var end_date=new Date(req.query.end);
		var dayInMillis = 86400000;
		vehicleStats=[];
		for(var j=0; j<vehicle.length; j++){
			for(var i=start_date.getTime(); i<end_date.getTime(); i=i+dayInMillis){
				var date=new Date(i);
				date=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
				VehicleStat({vehicle:vehicle[j]._id,vehicleStatus:getRandomKey(0,2),date:date}).save();
			}
		}
		        res.send("success");
		
	})
}

exports.addRandomDataGC  = function(req,res){
    CollectionCenter.find({}).exec(function(err,CC){
		var start_date=new Date(req.query.start);
		var end_date=new Date(req.query.end);
		var dayInMillis = 86400000;
		vehicleStats=[];
		for(var j=0; j<CC.length; j++){
			for(var i=start_date.getTime(); i<end_date.getTime(); i=i+dayInMillis){
				var date=new Date(i);
				date=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
				CollectionCenterStat({collectionCenter:CC[j]._id,collectionCenterStatus:getRandomKey(0,2),date:date}).save();
			}
		}
		        res.send("success");
		
	})
}

function getRandomVehicle(vehicle){
	return vehicle[getRandomKey(0,vehicle.length-1)];
}

function getRandomKey(min,max){
	return Math.round(Math.random() * (max - min) + min);
}

exports.fetch = function(req,res){
	VehicleStat.find({}).populate("vehicle").exec(function(err,vehicleStat){
		if(!err){
			res.send(vehicleStat);
		}
	})
}

exports.fetchGCStats = function(req,res){
    CollectionCenterStat.aggregate([
        {$lookup:
         {
           from: 'collectioncenters',
           localField: 'collectionCenter',
           foreignField: '_id',
           as: "GC"
         }},
        {$group:{
            _id:'$collectionCenter',
            gc : {$addToSet : '$GC'},
            full : {$sum:{$cond: { if: { $eq: [ "$collectionCenterStatus", 2 ] }, then: 1, else: 0 }}},
            half : {$sum:{$cond: { if: { $eq: [ "$collectionCenterStatus", 1 ] }, then: 1, else: 0 }}},
            empty : {$sum:{$cond: { if: { $eq: [ "$collectionCenterStatus", 0 ] }, then: 1, else: 0 }}},

        }}
    ]).exec(function(err,data){
        if(!err){
            res.send({'message':'success',status:1,data:data});
        }else{
            res.send({'message':'error',status:0,err:err}) ;   
        }
        
    })
}
/**
 * add vehicle stats of dumping ground for a particular day
 * added at the dumping ground / zone by the driver
 * 
 */
exports.add = function(req, res){
	var cur_date = new Date();
	cur_date = cur_date.getFullYear() + "-" + (cur_date.getMonth()+1) + "-" + cur_date.getDate();
	if(!req.body.vehicleId || !req.body.vehicleStatus ){
		if(!req.body.vehicleId){
			res.send({status:0, message: "Vehicle Identification failed"});
		}else if(!req.body.vehicleStatus){
			res.send({status:0, message:"Vehicle status required"});
		}
	} else {
		VehicleStat({vehicle: req.body.vehicleId, vehicleStatus: req.body.vehicleStatus, date: cur_date}).save(function(err, vehicleStat) {
			if(err){
				res.send({status: 0, message: err});
			}else{
				res.send({status: 1, message: "success", data: vehicleStat});
			}
		});
	}
}