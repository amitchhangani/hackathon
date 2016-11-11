var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var filterSchema = new Schema({
    filter_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    value: {
        type: Boolean,
        default: false
    }
});
var fieldSchema = new Schema({
    field_id: {
        type: String,
        required: true
    },
    field_name: {
        type: String,
        required: true
    },
    field_detail: {
        type: String,
        required: false
    },
});
var detailSchema = new Schema({
    shop_id: {
        type: Schema.Types.ObjectId,
        required: ['Shop id is empty'],
        ref: 'shopdetails'
    },
    store_name: {
        type: String,
        required:['Please enter store name.']

    },
    group_name: {
        type: String,
        ref : 'groups',
        default:"576b7cf10eaad93ee3dec535"

    },
    address: {
        type: String,
        required: true
    },
    address2: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    country_id: {
        type: String,
        required: true,
        ref: 'locations'
    },
    country_name: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    postal: {
        type: Number
    },
    custom_filters: [filterSchema],
    custom_fields: [fieldSchema],
    phone: {
        type: Number
    },
    fax: {
        type: Number
    },
    email: {
        type: String,
        match: [/\S+@\S+\.\S+/, 'Please enter valid email address']
    },
    website: {
        type: String,
        match: [/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/, 'Please enter valid website address']
    },
    latitude: {
        type: Number,
        required: 'Please enter valid latitude.'
    },
    longitude: {
        type: Number,
        required: 'Please enter valid longitude.'
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
    working_days: {
        type: Array
    },
    start_time: {
        type: Number
    },
    end_time: {
        type: Number
    },
    location:{
        type:[Number]
    }
});
var detailObj = mongoose.model('details', detailSchema);
module.exports = detailObj;