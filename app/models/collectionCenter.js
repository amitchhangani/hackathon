'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



var CollectionCenterSchema = new Schema({
	name:String,
	latlong:String
})

var CollectionCenter = module.exports = mongoose.model('CollectionCenter', CollectionCenterSchema);
