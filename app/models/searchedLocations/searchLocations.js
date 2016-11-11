var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var serchLocationSchema = new Schema({

	location: {
		type: String,
		required: true
	},
	hits: {
		type: Number,
		default: 1
	},
	shop_id: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'shopdetails'
	},
	positions: [],
	status: {
		type: Boolean,
		default: true
	},
	is_deleted: {
		type: Boolean,
		default: false
	},
	modified_on: {
		type: Date,
		default: Date.now()
	},
	created_at: {
		type: Date,
		default: Date.now()
	}

});
var locationObj = mongoose.model('searchedLocations', serchLocationSchema);
module.exports = locationObj;