var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var filterSchema = new Schema({
	shop_id: {
		type: String
	},
	filter: {
		type: String,
		match: [/^[A-Za-z ]+$/, 'Please enter valid filter name']
	},
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
var filterObj = mongoose.model('filters', filterSchema);
module.exports = filterObj;