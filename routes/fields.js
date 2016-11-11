module.exports = function(app, express) {
	var router = express.Router();
	var fieldObj = require('./../app/controllers/fields/fields.js');

	router.post('/addField', fieldObj.addField);
	router.post('/getField', fieldObj.getField);
	router.post('/deleteField', fieldObj.deleteField);

	app.use('/fields', router);
}