var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var locationSchema = new Schema({ 
    location_id         :  {type:Number},
    name                :  {type:String},
    location_type       :  {type:Number},
    parent_id           :  {type:Number},
    is_visible          :  {type:Number},
    status              :  {type:Boolean,default:true},
    is_deleted          :  {type:Boolean,default:false},
    modified_on         :  {type:Date,default:Date.now()},
    created_at          :  {type:Date,default:Date.now()}
},{collection:'location'});
var locationObj = mongoose.model('locations' , locationSchema);
module.exports = locationObj;