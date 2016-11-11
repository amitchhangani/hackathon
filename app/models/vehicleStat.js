'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



var VehicleStatSchema = new Schema({
	vehicle:{type: Schema.Types.ObjectId, ref: 'Vehicle'},
	vehicleStatus:{type:Number}, //0 fully empty, 1 half filled, 2 fully filled
	created:{type:Number, default:Date.now()},
	date:{type:String}
})

var VehicleStat = module.exports = mongoose.model('VehicleStat', VehicleStatSchema);
