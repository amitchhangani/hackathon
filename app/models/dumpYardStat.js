'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



var DumpYardStatSchema = new Schema({
	name:String,
	latlong:String,
	created:String
})

var DumpYardStat = module.exports = mongoose.model('DumpYardStat', DumpYardStatSchema);
