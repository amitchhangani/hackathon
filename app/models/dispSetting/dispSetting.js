var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dispSettingSchema = new Schema({
    shop_id: {
        type: String,
        ref: 'shopdetails'
    },
    page_title: {
        type: String,
        default: 'Store Locator'
    },
    text: {
        type: String,
        default: 'Find stores near this location'
    },
    default_text: {
        type: String,
        default: 'Postal/Zip Code'
    },
    search_button: {
        type: String,
        default: 'Search'
    },
    direction_text: {
        type: String,
        default: 'Get Directions'
    },
    store: {
        type: Boolean,
        default: true
    },
    store_message: {
        type: Boolean,
        default: false
    },
    nearest_store: {
        type: Number,
        default: 5
    },
    no_store_found: {
        type: String,
        default: 'No Stores Found'
    },
    map_load: {
        type: String,
        default: 'Yes'
    },
    initial_text: {
        type: String,
        default: 'Enter your city or postal/zip code to find locations near you.'
    },
    max_distance: {
        type: String,
        default: 'Distance'
    },
    max_result: {
        type: String,
        default: 'Results'
    },
    no_limit: {
        type: String,
        default: 'No Limit'
    },
    here: {
        type: String,
        default: 'You Are Here'
    },
    map_address: {
        type: [Number],
        default: [40.72803301704395, -74.21707885742187]
    },
    map_height: {
        type: Number,
        default: 400
    },
    map_zoom: {
        type: Number,
        default: 2
    },
    direction_language: {
        type: String,
        default: 'ENGLISH'
    },
    result_text: {
        type: String,
        default: '<< Back to Results'
    },
    color: {
        type: String,
        default: '006699'
    },
    website_address: {
        type: String,
        default: 'Yes'
    },
    popup_theme: {
        type: String,
        default: 'Light'
    },
    your_icon: {
        type: String,
        default: 'Black'
    },
    store_icon: {
        type: String,
        default: 'Light Blue'
    },
    unit: {
        type: String,
        default: 'KM',
        enum: ['KM', 'MI']
    },
    header: {
        type: String
    },
    footer: {
        type: String
    },
    address: {
        type: String,
        default: '[name]\n[address]\n[address2]\n[city], [prov_state] [postal_zip], [country]'
    },
    detailed: {
        type: String,
        default: '[name]\n[address]\n[address2]\n[city], [prov_state] [postal_zip], [country]\n\n Ph: [phone]\n Fax: [fax]\n [website]\n[email]\n\n[hours]'
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
var dispSettingObj = mongoose.model('dispSetting', dispSettingSchema);
module.exports = dispSettingObj;