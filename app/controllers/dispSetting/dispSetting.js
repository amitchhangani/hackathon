		var dispSettingObj = require('./../../models/dispSetting/dispSetting.js');
		var shopObj = require('./../../models/authenticate/authenticate.js');
		var configObj = require('./../../../constants.js');
		var mongoose = require('mongoose');

		/*________________________________________________________________________
		   * @Date:      		18 June 2015
		   * @Method :   		Add setting
		   * Created By: 		smartData Enterprises Ltd
		   * Modified On:		-
		   * @Purpose:   		To add a new setting
		 _________________________________________________________________________
		 */
		exports.addSetting = function(req, res, auth_url, result) {
			var data = req.body;
			//data.shop_id = data._id;
			data.shop_id = result._id;
			console.log('**************************\n\n\n', result, '\n\n\n**************');
			var dispSettingAdd = new dispSettingObj(data);
			dispSettingAdd.save(function(err, data) {
				if (!err) {


					var outputJson = {
						"status": "success",
						"messageId": 200,
						"auth_url": auth_url,
						"data": req.body
					}
					res.status(200).json(outputJson);


				} else {

					res.status(400).json({
						status: 'Faliure',
						messageId: 400,
						message: err
					});
				}
			});
		}

		exports.updateSettings = function(req, res) {
				if (req.body._id) {
					dispSettingObj.update({
						_id: req.body._id,
						shop_id: req.body.shop_id
					}, {
						$set: req.body
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
				} else {
					res.status(400).json({
						status: 'Faliure',
						messageId: 400,
						message: 'Invalid data'
					});
				}
			}
			/*________________________________________________________________________
		   * @Date:      		18 June 2015
		   * @Method :   		Display setting
		   * Created By: 		smartData Enterprises Ltd
		   * Modified On:		-
		   * @Purpose:   		To display settings
		   * @Return:    	 	yes
		 _________________________________________________________________________ */
		exports.getSetting = function(req, res) {

			if (req.session.shopLogin) {
				dispSettingObj.findOne({
						shop_id: req.session.shopLogin._id
					},
					function(err, response) {
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
								data: response
							});
						}
					})
			} else {
				res.status(400).json({
					status: 'Faliure',
					messageId: 400,
					message: 'You need to log in to access this information.'
				});

			}
		}

		exports.getDisplaySettings = function(req, res) {
			console.log("data fetched:", JSON.stringify(req.body));
			shopObj.findOne({
				shop: req.body.shop_id
			}).exec(function(err1, shopData) {
				if (err1) {
					res.status(400).json({
						status: 'Faliure',
						messageId: 400,
						message: err
					});
				} else {
					dispSettingObj.findOne({
						shop_id: shopData._id
					}).exec(function(err, data) {
						if (err) {
							res.status(400).json({
								status: 'Faliure',
								messageId: 400,
								message: err
							});
						} else {
							res.status(200).json({
								"status": 'Success',
								"messageId": 200,
								"data": data
							});
						}
					})
				}
			})

		}