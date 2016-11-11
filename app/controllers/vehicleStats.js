var mongoose = require('mongoose'),
    VehicleStat = mongoose.model('VehicleStat'),
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