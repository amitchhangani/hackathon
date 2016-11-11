'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



var CityAreaSchema = new Schema({
	name: String,
	area: [],
	city: {type: Schema.Types.ObjectId, ref: 'City'},
	created: Number
})

var CityArea = module.exports = mongoose.model('CityArea', CityAreaSchema);
