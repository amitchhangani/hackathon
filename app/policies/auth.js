var shopObj = require('./../models/authenticate/authenticate.js');
var detailObj = require('./../models/details/details.js');
var paymentModelObj = require('./../models/payment/payment.js');
var searchLocObj = require('./../models/searchedLocations/searchLocations.js');
exports.checkAdminPermission = function(action) {
	var outputJson = {};
	var middleware = false; // start out assuming this is not a middleware call

	return function(req, res, next) {
		console.log("middleware body:", JSON.stringify(req.body))
		detailObj.count({
			"shop_id": req.body.shop_id
		}).exec(function(err, data) {
			if (err) {
				console.log("eror", err)
				outputJson = {
					"status": "failure",
					"messageId": 400,
					"message": err
				}
				return res.jsonp(outputJson);
			}
			if (data == 0) {
				paymentModelObj.findOne({
					shop_Id: req.body.shop_id
				}).populate('shop_Id').exec(function(err1, data1) {
					console.log("populate auth:", data1)
					if (err1) {
						console.log("eror", err)
						outputJson = {
							"status": "failure",
							"messageId": 400,
							"message": err
						}
						return res.jsonp(outputJson);
					} else {
						console.log("plan details:", data1);
						if (req.session.shopLogin.payment_recieved == false) {
							console.log("free plan");
							if (data > 1 || data == 1) {
								outputJson = {
									"status": "success",
									"messageId": 422,
									"message": "Store limit crossed, according to plan, for more services please buy new plan.",
									"data": data1
								}
								return res.jsonp(outputJson);
							} else {
								next();
							}
						}
						if (data1.plan == 'Intermediate') {
							console.log("in intermediate if");
							if (data > 50 || data == 50) {
								outputJson = {
									"status": "success",
									"messageId": 423,
									"message": "Store limit crossed, according to plan, for more services please buy new plan.",
									"data": data1
								}
								return res.jsonp(outputJson);
							} else {
								next();
							}
						} else if (data1.plan = "Advanced") {
							next();
						} else {
							next(); //free trial
						}
					}
				})
			} else {
				paymentModelObj.findOne({
					shop_Id: req.body.shop_id
				}).populate('shop_Id').exec(function(err1, data1) {
					console.log("populate auth:", data1)
					if (err1) {
						console.log("eror", err)
						outputJson = {
							"status": "failure",
							"messageId": 400,
							"message": err
						}
						return res.jsonp(outputJson);
					} else {
						console.log("plan details:", data1);
						if (req.session.shopLogin.payment_recieved == false) {
							console.log("free plan");
							if (data > 1 || data == 1) {
								outputJson = {
									"status": "success",
									"messageId": 422,
									"message": "Store limit crossed, according to plan, for more services please buy new plan.",
									"data": data1
								}
								return res.jsonp(outputJson);
							} else {
								next();
							}
						}
						if (data1.plan == 'Intermediate') {
							console.log("in intermediate if");
							if (data > 50 || data == 50) {
								outputJson = {
									"status": "success",
									"messageId": 423,
									"message": "Store limit crossed, according to plan, for more services please buy new plan.",
									"data": data1
								}
								return res.jsonp(outputJson);
							} else {
								next();
							}
						} else if (data1.plan = "Advanced") {
							next();
						} else {
							next(); //free trial
						}
					}
				})
			}
		})

	}
};
exports.addLocation = function(action) {
	console.log("in add location middleware");

	return function(req, res, next) {
		console.log("in add location middleware23343");
		var outputJson = {};
		var shopData = {};
		var shop_name = new RegExp(req.body.shop_name, 'i');
		console.log("shop name:", shop_name);
		if (req.body.postal) {
			console.log('in if')
			shopObj.findOne({
				shop: shop_name
			}).exec(function(err5, data5) {
				if (err5) {
					outputJson = {
						"status": "failure",
						"messageId": 400,
						"message": "Shop credentials are not authorized"
					}

				} else {
					var inputJson = {
						"location": req.body.postal,
						"shop_id": data5._id,
						"positions": req.body.currentLocation.pos
					}
					console.log("in midlleware location add:", JSON.stringify(req.body));
					var address = new RegExp(req.body.postal, 'i');
					searchLocObj.findOne({
						$or: [{
							location: address
						}, {
							positions: req.body.currentLocation.pos
						}]

					}).exec(function(err1, data1) {
						if (err1) {
							console.log("err", err1)
							req.body.shop_data = data5;
							next();
						}
						if (!data1) {
							var add = new searchLocObj(inputJson);
							add.save(function(err2, data2) {
								if (err2) {
									console.log("err2:", err2)
									req.body.shop_data = data5;
									next();
								} else {
									console.log("success add location");
									req.body.shop_data = data5;
									next();
								}
							});
						} else {

							searchLocObj.update({
								"location": address,
								"shop_id": data5._id,
								"positions": req.body.currentLocation
							}, {
								$set: {
									"hits": data1.hits + 1
								}
							}).exec(function(err3, data3) {
								if (err3) {
									console.log("err3", err3);
									req.body.shop_data = data5;
									next();
								} else {
									console.log("update location success", data3);
									req.body.shop_data = data5;
									next();
								}
							})
						}
					})
				}
			})
		}
		else
		{
			console.log('in else')
			shopObj.findOne({
				shop: shop_name
			}).exec(function(err5, data5) {
				if(err5){
					outputJson = {
						"status": "failure",
						"messageId": 400,
						"message": "Shop credentials are not authorized"
					}

				}else{
					console.log('*****************\n',JSON.stringify(data5),'\n\n***************')
					req.body.shop_data = data5;
					next();
				}
			})
			
		}



	}

}
exports.checkPayment = function(action) {
	var outputJson = {};
	var middleware = false;
	return function(req, res, next) {
		if (req.session.shopLogin.payment_recieved == true) {
			next();
		} else {
			outputJson = {
				"status": "failure",
				"messageId": 400,
				"message": "Payment is not done."
			}
			return res.jsonp(outputJson);
		}
	}
}