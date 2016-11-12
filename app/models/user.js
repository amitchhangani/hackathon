'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



var UserSchema = new Schema({
	name: {type:String},
	role: {type:String},
	vehicleId: {type: Schema.Types.ObjectId, ref: 'Vehicle',default:null},
	created: {type:Number, default:Date.now()},
	collectionCenter : {type: Schema.Types.ObjectId, ref: 'CollectionCenter',default:null}
})

var User = module.exports = mongoose.model('User', UserSchema);
