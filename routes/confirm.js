module.exports = function(app, express) {

	var router = express.Router();
	var shopifyObj = require('./../app/controllers/payment/payment.js');
	
	router.post('/confirm', shopifyObj.confirm);
	

}