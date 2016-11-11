'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



var VehicleSchema = new Schema({
	name: {type:String},
	type: {type:String},
	capacity: {type:Number},
	collection_points: [],
	created: {type:Number, default:Date.now()}
})

var Vehicle = module.exports = mongoose.model('Vehicle', VehicleSchema);
