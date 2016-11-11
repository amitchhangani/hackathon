var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var shopBillSchema = new Schema({

	shop_Id:{type:Schema.Types.ObjectId,unique:true,required:'shop id is empty!',ref:'shopdetails'},
	billing_Id:{type:String,unique:true},
	plan:{type:String},
	status:{type:Boolean,default:true},
	is_deleted:{type:Boolean,default:false},
	modified_on:{type:Date,default:Date.now()},
	created_at:{type:Date,default:Date.now()}
});



var shopBillDetailsObj = mongoose.model('shopsBillings', shopBillSchema);
module.exports = shopBillDetailsObj;