module.exports = function(app, express) {
	var router = express.Router();
	var filterObj = require('./../app/controllers/filters/filters.js');

	router.post('/addFilter', filterObj.addFilter);
	router.post('/getFilter', filterObj.getFilter);
	router.post('/deleteFilter', filterObj.deleteFilter);
	router.get('/getAllFilters',filterObj.getAllFilters);

	app.use('/filters', router);
}