		var mapkeyObj = require('./../../models/mapkey/mapkey.js');
		var shopObj = require('./../../models/authenticate/authenticate.js');
		var mongoose = require('mongoose');
		/*________________________________________________________________________
		   * @Date:      		17 June 2016
		   * @Method :   		Save google map api key
		   * Created By: 		smartData Enterprises Ltd
		   * Modified On:		-
		   * @Purpose:   		to save google map api key.
		 _________________________________________________________________________
		 */
		exports.addmapkey = function(req, res) {
				if (req.body.api_key) {
					var data = req.body;
					if (!data._id) {
						var mapkeyAdd = new mapkeyObj(data);
						mapkeyAdd.save(function(err, data) {
							if (!err) {
								res.status(200).json({
									status: 'Success',
									messageId: 200,
									message: 'Data Saved Successfully'
								});
							} else {
								res.status(400).json({
									status: 'Faliure',
									messageId: 400,
									message: err
								});
							}
						});
					} else {
						var id = data._id;
						delete data._id;
						mapkeyObj.update({
							_id: id,
							shop_id: req.body.shop_id
						}, {
							$set: data
						}, {
							upsert: false
						}, function(err, result) {
							if (!err) {
								res.status(200).json({
									status: 'Success',
									messageId: 200,
									message: 'Data Saved Successfully'
								});
							} else {
								res.status(400).json({
									status: 'Faliure',
									messageId: 400,
									message: err
								});
							}
						});
					}
				} else {
					res.status(400).json({
						status: 'Faliure',
						messageId: 400,
						message: 'Required field missing'
					});
				}
			}
			/*________________________________________________________________________
			   * @Date:      		21 June 2016
			   * @Method :   		Get google map api key
			   * Created By: 		smartData Enterprises Ltd
			   * Modified On:		-
			   * @Purpose:   		to display google map api key.
			 _________________________________________________________________________
			 */
		exports.getmapkey = function(req, res) {
			if (req.session.shopLogin) {
				mapkeyObj.findOne({
					shop_id: req.session.shopLogin._id,
					is_deleted: false
				}, function(err, data) {
					if (err) {
						res.status(400).json({
							status: 'Faliure',
							messageId: 400,
							message: err
						});
					} else {
						res.status(200).json({
							status: 'Success',
							messageId: 200,
							message: 'Data Displayed Successfully',
							data: data
						});

					}
				});
			}
		}
		exports.getMapKey = function(req, res) {
			var outputJson = {};
			console.log("data shop url:", req.body)
			shopObj.findOne({
				shop: req.body.shop_name
			}).exec(function(err, data) {
				if (err) {
					outputJson = {
						"status": "failure",
						"messageId": 400,
						"message": err
					}
					return res.jsonp(outputJson);
				} else {
					mapkeyObj.findOne({
						shop_id: data._id
					}).exec(function(err1, data1) {
						if (err1) {
							outputJson = {
								"status": "failure",
								"messageId": 400,
								"message": err1
							}
							return res.jsonp(outputJson);
						} else {
							outputJson = {
								"status": "success",
								"messageId": 200,
								"data": data1
							}
							return res.jsonp(outputJson);

						}
					})
				}
			})

		}