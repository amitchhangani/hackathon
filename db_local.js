/*
 * The file will take care of the database connectivity
 172.24.0.210
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://172.24.0.210:27017/shopify');

//check if we are connected successfully or not
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));