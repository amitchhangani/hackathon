'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



var VehichleSchema = new Schema({
	name: {type:String},
	type: {type:String},
	capacity: {type:String},
	collection_points: [],
	created: {type:Number, default:Date.now()}
})

var Vehichle = module.exports = mongoose.model('Vehichle', VehichleSchema);
