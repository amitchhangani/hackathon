'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



var VehicleSchema = new Schema({
	name: {type:String},
	type: {type:String},
	capacity: {type:String},
	city: {type: Schema.Types.ObjectId, ref: 'City'},
	collectionCenters: [{type: Schema.Types.ObjectId, ref: 'CollectionCenter'}],
	created: {type:Number, default:Date.now()}
})

var Vehicle = module.exports = mongoose.model('Vehicle', VehicleSchema);
