'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



var CollectionCenterStatSchema = new Schema({
	collectionCenter:{type: Schema.Types.ObjectId, ref: 'CollectionCenter'},
	collectionCenterStatus:{type:Number}, //0 fully empty, 1 half filled, 2 fully filled
	created:{type:Number, default:Date.now()},
	date:{type:String}
})

var CollectionCenterStat = module.exports = mongoose.model('CollectionCenterStat', CollectionCenterStatSchema);
