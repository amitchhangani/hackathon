'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



var CollectionCenterSchema = new Schema({
	name:{type:String},
	lat:{type:String},
	long:{type:String},
	city: {type: Schema.Types.ObjectId, ref: 'City'},
	created:{type:Number},
	deleted:{type:Boolean,default:0}
})

var CollectionCenter = module.exports = mongoose.model('CollectionCenter', CollectionCenterSchema);
