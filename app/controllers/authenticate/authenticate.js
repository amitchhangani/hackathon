//authenticate shop url
var shopObj = require('./../../models/authenticate/authenticate.js');
var shopifyAPI = require('shopify-node-api');
var paymentModelObj = require('./../../models/payment/payment.js');
var configObj = require('./../../../constants.js');
var path = require('path');
var dispSettingObj = require('./../../controllers/dispSetting/dispSetting.js');
var mongoose = require('mongoose');
/*________________________________________________________________________
   * @Date:      		24 June 2015
   * @Method :   		webhook creation
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   		to create webhook for shop
   * @Param:     		0
   * @Return:    	 	yes
_________________________________________________________________________
*/
function webHook(req, res, auth_url) {
	console.log("co0nsole log in webhook code");
	var outputJson = {};
	var Shopify = new shopifyAPI({
		shop: req.session.shopLogin.shop,
		shopify_api_key: configObj.inputJson.shopify_api_key,
		shopify_shared_secret: configObj.inputJson.shopify_shared_secret,
		access_token: req.session.shopLogin.access_token
	});
	console.log("first time:", JSON.stringify(Shopify));
	var post_data = {
		"webhook": {
			"topic": "app\/uninstalled",
			"address": "https:\/\/203.100.79.82:5513\/uninstall_messages",
			"format": "json"
		}
	};
	Shopify.post('/admin/webhooks.json', post_data, function(errors, results) {
		if (errors) {
			console.log("error in webhook")
		} else {
			shopObj.update({
				shop: req.session.shopLogin.shop,
				is_deleted: false
			}, {
				webHook: true
			}).exec(function(errorsWeb, resultWeb) {
				if (errorsWeb) {
					res.sendFile(path.join(__dirname + './../../../public/redirect.html'));
				} else {
					res.sendFile(path.join(__dirname + './../../../public/redirect.html'));
				}
			})


		}

	})
}

/*________________________________________________________________________
   * @Date:      		13 June 2015
   * @Method :   		authenticate
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   		to check credentials and install shopify app
   * @Param:     		0
   * @Return:    	 	yes
_________________________________________________________________________
*/
exports.authenticate = function(req, res) {
	console.log("in auth");
	console.log("req.body:", JSON.stringify(req.body));
	var outputJson = {};
	var Shopify = new shopifyAPI(req.body);
	var auth_url = Shopify.buildAuthURL();
	console.log("auth url:", auth_url);
	if (req.body) {
		var shopName = new RegExp(req.body.shop, 'i');
		shopObj.findOne({
			"shop": shopName,
			is_deleted: false
		}, function(err, data) {
			if (err) {
				outputJson = {
					"status": "failure",
					"messageId": 400,
					"message": configObj.unauthorized
				}
				return res.jsonp(outputJson);
			}
			if (!data) {

				var input = new shopObj(req.body);

				input.save(function(error, result) {
					if (error) {
						outputJson = {
							"status": "failure",
							"messageId": 400,
							"message": configObj.unauthorized
						}
						return res.jsonp(outputJson);
					} else {

						dispSettingObj.addSetting(req, res, auth_url, result)


					}
				})
			} else {
				req.body.is_deleted = false;
				console.log("nonce:",JSON.stringify(req.body));
				shopObj.update({
					"shop": req.body.shop
					
				}, {
					$set: req.body,


				}, function(error, result) {

					if (error) {
						outputJson = {
							"status": "failure",
							"messageId": 400,
							"message": configObj.unauthorized
						}
						return res.jsonp(outputJson);
					} else {

						outputJson = {
							"status": "success",
							"messageId": 200,
							"auth_url": auth_url,
							"data": req.body
						}

						return res.jsonp(outputJson);
					}

				})
			}
		})
	} else {
		outputJson = {
			"status": "failure",
			"messageId": 400,
			"message": configObj.missingDetails
		}
		return res.jsonp(outputJson);
	}

}

/*________________________________________________________________________
   * @Date:      		13 June 2015
   * @Method :   		step3
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   		to check temprary credentials and generate permanent token
   * @Param:     		3
   * @Return:    	 	yes
_________________________________________________________________________
*/
exports.step3 = function(req, res) {
	var config = {};

	if (req.query.shop) {
		shopObj.findOne({
			shop: req.query.shop
		}, function(err, data) {
			if (err) {
				outputJson = {
					"status": "failure",
					"messageId": 400,
					"message": configObj.unauthorized
				}
				return res.jsonp(outputJson);
			} else {

				config = configObj.inputJson;
				config.shop = req.query.shop;
				config.nonce = data.nonce;

				var Shopify = new shopifyAPI(config),
					query_params = req.query;
				Shopify.exchange_temporary_token(query_params, function(err1, data1) {
					if (err1) {
						console.log("error:", err1);
						var outputJson = {
							"status": "failure",
							"messageId": 400,
							"message": configObj.unauthorized
						}
						return res.jsonp(outputJson);
					} else {

						shopObj.update({
							shop: req.query.shop
						}, {
							$set: {
								"access_token": data1.access_token
							}
						}, function(error, result) {
							if (err) {
								var outputJson = {
									"status": "failure",
									"messageId": 400,
									"message": configObj.unauthorized
								}
								return res.jsonp(outputJson);
							} else {



								shopObj.findOne({
									shop: req.query.shop
								}, function(err2, shopData) {
									if (err2) {
										var outputJson = {
											"status": "failure",
											"messageId": 400,
											"message": configObj.sessionError
										}
										return res.jsonp(outputJson);


									} else {
										req.session.shopLogin = shopData;
										if (shopData.webHook == false) {
											webHook(req, res);
										} else {
											res.sendFile(path.join(__dirname + './../../../public/redirect.html'));
										}

									}
								});
							}
						})

					}
				});
			}
		});
	}


}

/*________________________________________________________________________
   * @Date:      		14 June 2015
   * @Method :   		session details
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   		to get shop session data and payment details
   * @Param:     		0
   * @Return:    	 	yes
_________________________________________________________________________
*/
exports.session = function(req, res) {
	var outputJson = {};

	if (req.session.shopLogin) {

		paymentModelObj.find({
			shop_Id: mongoose.Types.ObjectId(req.session.shopLogin._id)
		}).populate('shop_Id').exec(function(err, data) {

		})
		outputJson = {
			"status": "success",
			"messageId": 200,
			"data": req.session.shopLogin
		};
		return res.jsonp(outputJson);
	} else {

		outputJson = {
			"status": "failure",
			"messageId": 400,
			"message": configObj.sessionExpired
		};
		return res.jsonp(outputJson);
	}



}

/*________________________________________________________________________
   * @Date:      		15 June 2015
   * @Method :   		Logout
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   		to get logout form app
   * @Param:     		0
   * @Return:    	 	yes
_________________________________________________________________________
*/

exports.logout = function(req, res) {
	var outputJson = {};
	if (req.session.shopLogin) {
		req.session.shopLogin = null;

		outputJson = {
			"status": "success",
			"messageId": 200,
			"mesage": "session deleted"


		};
		return res.jsonp(outputJson);

	} else {
		outputJson = {
			"status": "failure",
			"messageId": 400


		};
		return res.jsonp(outputJson);
	}
}

/*________________________________________________________________________
   * @Date:      		24 June 2015
   * @Method :   		webhook
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   		to get details delete of shop and billing on uninstall
   * @Param:     		0
   * @Return:    	 	yes
_________________________________________________________________________
*/
exports.uninstall2 = function(req, res) {

	if (req.body) {
		shopObj.findOne({
			shop: req.body.myshopify_domain
		}).exec(function(err, data) {
			if (err) {
				res.status(200).send("success");
			} else {
				if (!data) {
					res.status(200).send("success");
				} else {
					console.log("data findone webhook:", JSON.stringify(data));
					shopObj.update({
						_id: data._id
					}, {
						is_deleted: true,
						payment_recieved: false
					}).exec(function(err1, data1) {
						if (err1) {
							res.status(200).send("success");
						} else {

							paymentModelObj.update({
								shop_Id: data._id
							}, {
								is_deleted: true
							}).exec(function(err2, data2) {
								if (err2) {
									res.status(200).send("success");
								} else {
									res.status(200).send("success");
								}
							})
						}
					})
				}
			}
		})

	}
}