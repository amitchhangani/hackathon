var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var shopInfoSchema = new Schema({

	shop: {
		type: String,
		required: 'Please enter valid shop url.',
		unique: true
	},
	shopify_scope: {
		type: String,
		required: 'permission field is empty.'
	},
	myshopify_domain: {
		type: String
	},
	domain: {
		type: String
	},
	access_token: {
		type: String
	},
	nonce: {
		type: String
	},
	payment_recieved: {
		type: Boolean,
		default: false
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
	webHook:{
		type:Boolean,
		default : false
	}
});



var shopDetailsObj = mongoose.model('shopdetails', shopInfoSchema);
module.exports = shopDetailsObj;