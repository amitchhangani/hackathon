'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var ReportGarbageSchema = new Schema({
	address:{type:String},
	lat:{type:String},
	lng:{type:String},
	city: {type: Schema.Types.ObjectId, ref: 'City'},
	created:{type:Number},
	deleted:{type:Boolean, default:0}
})

var ReportGarbage = module.exports = mongoose.model('ReportGarbage', ReportGarbageSchema);
