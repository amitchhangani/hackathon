		var filterObj = require('./../../models/filters/filters.js');

		var mongoose = require('mongoose');
		/*________________________________________________________________________
		   * @Date:      		14 June 2015
		   * @Method :   		Add Filter
		   * Created By: 		smartData Enterprises Ltd
		   * Modified On:		-
		   * @Purpose:   		to add a new filter.
		 _________________________________________________________________________
		 */
		exports.addFilter = function(req, res) {
				var errorMessage = "";

				var filterAdd = new filterObj(req.body);
				filterObj.findOne({
					shop_id: req.body.shop_id,
					filter: req.body.filter,
					is_deleted: false
				}).exec(function(err, data) {
					if (err) {
						res.status(400).json({
							'status': 'failure',
							'messageId': 400,
							'message': err
						});
					}
					if (!data) {
						filterAdd.save(function(err1, data1) {
							console.log("error:", err);
							if (!err1) {

								res.status(200).json({
									status: 'Success',
									messageId: 200,
									message: 'Filter added Successfully'
								});
							} else {
								switch (err1.name) {
									case 'ValidationError':
										for (field in err1.errors) {
											if (errorMessage == "") {
												errorMessage = err1.errors[field].message;
											} else {
												errorMessage += ", " + err1.errors[field].message;
											}
										} //for
										break;
									case 'MongoError':
										errorMessage = "Duplicate filter name."
										break;
								} //switch
								res.status(400).json({
									'status': 'failure',
									'messageId': 400,
									'message': errorMessage
								});
							}
						});
					} else {
						res.status(401).json({
							'status': 'failure',
							'messageId': 401,
							'message': "Duplicate filter name."
						});
					}
				})

			}
			/*________________________________________________________________________
			  * @Date:      		14 June 2015
			  * @Method :   		Display Filter 
			  * Created By: 		smartData Enterprises Ltd
			  * Modified On:		-
			  * @Purpose:   		to display filter.
			  * @Return:    	 	yes
			_________________________________________________________________________
			*/
		exports.getFilter = function(req, res) {
				filterObj.find({
					shop_id: req.body.id,
					is_deleted: false
				}, function(err, data) {
					if (err) {
						return res.json({
							status:"failure",
							messageId:400,
							message: err
						});
					} else {
						return res.json({
							status: "success",
							messageId:200,
							data: data
						});
					}
				});
			}
			/*________________________________________________________________________
			  * @Date:      		16 June 2015
			  * @Method :   		Delete Filter 
			  * Created By: 		smartData Enterprises Ltd
			  * Modified On:		-
			  * @Purpose:   		to delete filter.
			_________________________________________________________________________
			*/
		exports.deleteFilter = function(req, res) {
			if (req.body.id) {
				filterObj.update({
					_id: req.body.id
				}, {
					$set: {
						is_deleted: true
					}
				}, {}, function(err) {
					if (!err) {
						res.status(200).json({
							status: 'Success',
							messageId: 200,
							message: 'Data Deleted Successfully'
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
					message: 'No Valid Id'
				});
			}
		}



		exports.getAllFilters = function(req, res) {
			var outputJson = {};
			filterObj.find({
				is_deleted: false
			}).exec(function(err, data) {
				if (err) {
					outputJson = {
						"status": "failure",
						"messageId": 400,
						"message": err
					};
				} else {
					outputJson = {
						"status": "success",
						"messageId": 200,
						"data": data
					};
				}
				return res.jsonp(outputJson);
			})
		}