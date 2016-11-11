'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



var DumpYardSchema = new Schema({
	name:String,
	latlong:String,
	created:Number,
	deleted:Boolean
})

var DumpYard = module.exports = mongoose.model('DumpYard', DumpYardSchema);
