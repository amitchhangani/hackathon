'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



var CitySchema = new Schema({
	name:{type:String},
	lat:{type:String},
	long:{type:String},
	created:{type:Number, default:Date.now()}
})

var City = module.exports = mongoose.model('City', CitySchema);
