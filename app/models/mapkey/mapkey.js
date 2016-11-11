var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mapkeySchema = new Schema({
	shop_id       	: {type:String, ref: 'shopdetails',unique:true},
    api_key         : {type:String,required: true},
    status          : {type:Boolean,default:true},
    is_deleted      : {type:Boolean,default:false},
    modified_on     : {type:Date,default:Date.now()},
    created_at      : {type:Date,default:Date.now()}
});
var mapkeyObj = mongoose.model('mapkey' , mapkeySchema);
module.exports = mapkeyObj;