var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var groupSchema = new Schema({
	shop_id:{
		type:String,
		required:['shop id is empty']
	},
	group_name: {
		type: String,
		required: ['Please enter group name'],
		match: [/^[A-Za-z ]+$/, 'Please enter valid group name']
		
	},
	color: {
		type: String,
		required: ['Please enter icon color for group']
	},

	never: {
		type: Boolean,
		default:true

	},
	hide: {
		type: String,
		default:'N/A'
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
	},
	default:{
		type : Boolean,
		default: false
	}
});
var groupObj = mongoose.model('groups', groupSchema);
module.exports = groupObj;