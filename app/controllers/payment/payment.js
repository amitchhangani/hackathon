var paymentModelObj = require('./../../models/payment/payment.js');
var shopObj = require('./../../models/authenticate/authenticate.js');
var shopifyAPI = require('shopify-node-api');
var configObj = require('./../../../constants.js');
var path2 = require('path');
/*________________________________________________________________________
   * @Date:      		14 June 2015
   * @Method :   		payment
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   		to check and charge the user for app
   * @Param:     		0
   * @Return:    	 	yes
_________________________________________________________________________
*/
exports.paymentCharge = function(req, res) {
	var outputJson = {};
	if (!req.session.shopLogin) {
		outputJson = {
			"status": "failure",
			"messageId": 400,
			"data": "Seesion Failure"
		}
		return res.jsonp(outputJson);
	}
	var Shopify = new shopifyAPI({
		shop: req.session.shopLogin.shop,
		shopify_api_key: configObj.inputJson.shopify_api_key,
		shopify_shared_secret: configObj.inputJson.shopify_shared_secret,
		access_token: req.session.shopLogin.access_token
	});

	var post_data = {
		"recurring_application_charge": req.body.recurring_application_charge
	};
	/*	console.log("data sent to api shopify:", JSON.stringify(post_data));*/
	Shopify.post('/admin/recurring_application_charges.json', post_data, function(err, data, headers) {
		if (err) {
			console.log("error:", err);
			outputJson = {
				"status": "failure",
				"messageId": 400,
				"message": err
			}
			return res.jsonp(outputJson);
		} else {
			console.log("success charge:", JSON.stringify(data));
			req.session.initialPayment = data;
			outputJson = {
				"status": "success",
				"messageId": 200,
				"data": data
			}
			return res.jsonp(outputJson);
		}
	});
}

exports.confirm = function(req, res) {
	console.log("initial payment:", JSON.stringify(req.session.initialPayment));
	var query_params = req.query.charge_id;
	console.log("query params:", query_params);
	var Shopify = new shopifyAPI({
		shop: req.session.shopLogin.shop,
		shopify_api_key: configObj.inputJson.shopify_api_key,
		shopify_shared_secret: configObj.inputJson.shopify_shared_secret,
		access_token: req.session.shopLogin.access_token
	});
	var postData = {
		"recurring_application_charge": req.session.initialPayment.recurring_application_charge
	};
	delete postData.recurring_application_charge.confirmation_url;
	console.log("data sent in 2:", JSON.stringify(postData));
	var path = "/admin/recurring_application_charges/" + query_params + "/activate.json";
	Shopify.post(path, postData, function(errors, confirm, headers) {
		if (errors) {
			res.sendFile(path2.join(__dirname + './../../../public/redirect.html'));
		} else {
			if (confirm.recurring_application_charge.status == "active") {
				var input = new paymentModelObj({
					"shop_Id": req.session.shopLogin._id,
					"billing_Id": confirm.recurring_application_charge.id,
					"plan": confirm.recurring_application_charge.name,
				});
				paymentModelObj.findOne({
					shop_id: req.session.shopLogin._id
				}).exec(function(err9, data9) {
					if (err9) {
						outputJson = {
							"status": "failure",
							"messageId": 400,
							"message": "Payment is done but billing not saved."
						}
						return res.jsonp(outputJson);
					}
					if (!data9) {
						input.save(function(err, result) {
							if (err) {
								console.log(err);
								outputJson = {
									"status": "failure",
									"messageId": 400,
									"message": "Payment is done but billing not saved."
								}
								return res.jsonp(outputJson);

							} else {
								shopObj.update({
									_id: req.session.shopLogin._id
								}, {
									$set: {
										payment_recieved: true,
										freePlan: false
									}
								}, function(mistake, output) {
									if (mistake) {
										console.log("error:", mistake);
									} else {
										Shopify.get('/admin/shop.json?domain,myshopify_domain', function(errors1, confirm1) {
											if (errors1) {
												console.log("error", errors1)
												req.session.shopLogin.payment_recieved = true;
												console.log("confirm:", JSON.stringify(confirm))

												//res.redirect('https://' + req.session.shopLogin.shop+ '/admin/apps/4ea07e2f38551e685215517a53b4d15b');
												res.sendFile(path2.join(__dirname + './../../../public/redirect.html'));
											} else {
												var finalInput = {};
												console.log("data from shopify:", JSON.stringify(confirm1));
												if (confirm1.shop) {
													if (confirm1.shop.domain && confirm1.shop.myshopify_domain) {
														finalInput = {
															domain: confirm1.shop.domain,
															myshopify_domain: confirm1.shop.myshopify_domain
														};
													}
													if (confirm1.shop.myshopify_domain) {
														finalInput = {
															myshopify_domain: confirm1.shop.myshopify_domain
														};
													}
													shopObj.update({
														_id: req.session.shopLogin._id
													}, finalInput, function(err6, err7) {
														if (err6) {
															req.session.shopLogin.payment_recieved = true;
															console.log("confirm:", JSON.stringify(confirm))
															console.log("confirm1:", JSON.stringify(confirm1))
																//res.redirect('https://' + req.session.shopLogin.shop+ '/admin/apps/4ea07e2f38551e685215517a53b4d15b');
															res.sendFile(path2.join(__dirname + './../../../public/redirect.html'));

														} else {
															req.session.shopLogin.payment_recieved = true;
															console.log("confirm:", JSON.stringify(confirm))
															console.log("confirm1:", JSON.stringify(confirm1))
																//res.redirect('https://' + req.session.shopLogin.shop+ '/admin/apps/4ea07e2f38551e685215517a53b4d15b');
															res.sendFile(path2.join(__dirname + './../../../public/redirect.html'));

														}
													})
												}
											}
										});

									}
								})

							}
						})
					} else {
						paymentModelObj.update({
								"shop_Id": req.session.shopLogin._id
							}, {
								$set: {
									"billing_Id": confirm.recurring_application_charge.id,
									"plan": confirm.recurring_application_charge.name
								}
							}

						).exec(function(err10, data10) {
							if (err10) {
								outputJson = {
									"status": "failure",
									"messageId": 400,
									"message": "Payment is done but billing not saved."
								}
								return res.jsonp(outputJson);
							} else {
								shopObj.update({
									_id: req.session.shopLogin._id
								}, {
									$set: {
										payment_recieved: true,
										freePlan: false
									}
								}, function(mistake1, output1) {
									if (mistake1) {
										console.log("error:", mistake1);
									} else {
										Shopify.get('/admin/shop.json?domain,myshopify_domain', function(errors2, confirm2) {
											if (errors2) {
												console.log("error", errors2)
												req.session.shopLogin.payment_recieved = true;
												console.log("confirm:", JSON.stringify(confirm2))

												//res.redirect('https://' + req.session.shopLogin.shop+ '/admin/apps/4ea07e2f38551e685215517a53b4d15b');
												res.sendFile(path2.join(__dirname + './../../../public/redirect.html'));
											} else {
												var finalInput = {};
												console.log("data from shopify:", JSON.stringify(confirm2));
												if (confirm2.shop) {
													if (confirm2.shop.domain && confirm2.shop.myshopify_domain) {
														finalInput = {
															domain: confirm2.shop.domain,
															myshopify_domain: confirm2.shop.myshopify_domain
														};
													}
													if (confirm2.shop.myshopify_domain) {
														finalInput = {
															myshopify_domain: confirm2.shop.myshopify_domain
														};
													}
													shopObj.update({
														_id: req.session.shopLogin._id
													}, finalInput, function(err61, err71) {
														if (err61) {
															req.session.shopLogin.payment_recieved = true;
															console.log("confirm:", JSON.stringify(confirm))
															console.log("confirm1:", JSON.stringify(confirm2))
																//res.redirect('https://' + req.session.shopLogin.shop+ '/admin/apps/4ea07e2f38551e685215517a53b4d15b');
															res.sendFile(path2.join(__dirname + './../../../public/redirect.html'));

														} else {
															req.session.shopLogin.payment_recieved = true;
															console.log("confirm:", JSON.stringify(confirm))
															console.log("confirm1:", JSON.stringify(confirm2))
																//res.redirect('https://' + req.session.shopLogin.shop+ '/admin/apps/4ea07e2f38551e685215517a53b4d15b');
															res.sendFile(path2.join(__dirname + './../../../public/redirect.html'));

														}
													})
												}
											}
										});

									}
								})
							}
						})
					}
				})


			}


		}

	})
}

exports.getDetails = function(req, res) {
	var outputJson = {};
	console.log("json.stringify:", JSON.stringify(req.body));
	paymentModelObj.findOne({
		shop_Id: req.body.shop_id
	}).populate('shop_Id').exec(function(err, data) {
		if (err) {
			console.log(err);
			outputJson = {
				"status": "failure",
				"messageId": 400,
				"message": err
			}
			return res.jsonp(outputJson)

		} else {
			if (!data) {
				outputJson = {
					"status": "failure",
					"messageId": 401,
					"message": "Payment is not done yet."
				}
				return res.jsonp(outputJson);

			} else {
				if (data.shop_Id.payment_recieved == true) {
					outputJson = {
						"status": "success",
						"messageId": 200,
						"data": data
					}
					return res.jsonp(outputJson);
				} else {
					outputJson = {
						"status": "success",
						"messageId": 201,
						"data": data
					}
					return res.jsonp(outputJson);
				}
			}

		}
	})
}