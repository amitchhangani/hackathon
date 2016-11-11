module.exports = function(app, express) {

	var router = express.Router();
	var paymentObj = require('./../app/controllers/payment/payment.js');
	router.post('/recurringcharges', paymentObj.paymentCharge);
	router.get('/confirm', paymentObj.confirm);
	router.post('/getPaymentDetails',paymentObj.getDetails);
	app.use('/payment', router);

}