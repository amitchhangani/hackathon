var path= require('path');
module.exports = function(app, express, shopifyAPI) {

	var router = express.Router();
	var shopifyObj = require('./../app/controllers/authenticate/authenticate.js');
	router.get('/finish_auth', shopifyObj.step3);
	router.get('/sessionGet', shopifyObj.session);
	router.post('/uninstall_messages', shopifyObj.uninstall2);
	router.get('/goToIframe', function(req, res) {
		res.sendFile(path.join(__dirname + './../public/redirect.html'));
	});
	router.get('/front', function(req, res) {
		res.sendFile(path.join(__dirname + './../public/index2.html'));
	});
	app.use('/', router);

}