'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



var UserSchema = new Schema({
	name: {type:String},
	role: {type:String},
	vehicleId: {type: Schema.Types.ObjectId, ref: 'Vehicle'},
	created: {type:Number, default:Date.now()}
})

var User = module.exports = mongoose.model('User', UserSchema);
