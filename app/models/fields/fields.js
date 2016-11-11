var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var fieldSchema = new Schema({
	shop_id: {
		type: String
	},
	field: {
		type: String,
		match: [/^[A-Za-z ]+$/, 'Please enter valid field name']
	},
	detail: {
		type: String
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
var fieldObj = mongoose.model('fields', fieldSchema);
module.exports = fieldObj;