module.exports = function(app, express) {
	var router = express.Router();
	var locationObj = require('./../app/controllers/locations/locations.js');

	router.get('/getLocation',locationObj.getLocation);
	router.post('/getState',locationObj.getState);
	
	app.use('/locations', router);
}