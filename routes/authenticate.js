var path = require('path');
module.exports = function(app, express, shopifyAPI) {

	var router = express.Router();
	var shopifyObj = require('./../app/controllers/authenticate/authenticate.js');
	router.post('/auth', shopifyObj.authenticate);
	router.get('/getExit', shopifyObj.logout);
	
	app.use('/authenticate', router);

}