module.exports = function(app, express) {
	var router = express.Router();
	var mapkeyObj = require('./../app/controllers/mapkey/mapkey.js');

	router.post('/addmapkey', mapkeyObj.addmapkey);

	router.get('/getmapkey',mapkeyObj.getmapkey);
	router.post('/getKey',mapkeyObj.getMapKey);
	

	app.use('/mapkey', router);
}