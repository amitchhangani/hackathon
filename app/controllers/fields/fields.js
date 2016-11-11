		var fieldObj = require('./../../models/fields/fields.js');
		var mongoose = require('mongoose');
		/*________________________________________________________________________
		   * @Date:      		13 June 2015
		   * @Method :   		Add Field 
		   * Created By: 		smartData Enterprises Ltd
		   * Modified On:		-
		   * @Purpose:   		To add a new field
		   * @Return:    	 	yes
		 ________________________________________________________________________*/
		exports.addField = function(req, res) {
				var fieldAdd = new fieldObj(req.body);
				var errorMessage = "";
				fieldObj.findOne({
					shop_id: req.body.shop_id,
					field: req.body.field,
					is_deleted:false
				}).exec(function(err, data) {
					if (err) {
						res.status(400).json({
							status: 'Faliure',
							messageId: 400,
							message: err
						});
					}
					if (!data) {
						fieldAdd.save(function(err1, data1) {
							console.log("error:", err);
							if (!err1) {
								res.status(200).json({
									'status': 'success',
									'messageId': 200,
									'message': "field added successfully."
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
										errorMessage = "Duplicate field name!"
										break;
								} //switch
								res.status(400).json({
									status: 'Faliure',
									messageId: 400,
									message: errorMessage
								});
							}
						});
					} else {
						res.status(400).json({
							'status': 'failure',
							'messageId': 400,
							'message': "Duplicate field Name."
						});
					}
				})

			}
			/*________________________________________________________________________
			   * @Date:      		13 June 2015
			   * @Method :   		Display Field 
			   * Created By: 		smartData Enterprises Ltd
			   * Modified On:		-
			   * @Purpose:   		To display fields
			   * @Return:    	 	yes
			 _________________________________________________________________________
			 */
		exports.getField = function(req, res) {
				fieldObj.find({
					shop_id: req.body.id,
					is_deleted: false
				}, function(err, data) {
					if (err) {
						return res.json({
							status: "failure",
							messageId : 400,
							message: err
						});
					} else {
						return res.json({
							status:"success",
							messageId:200,
							data: data
						});
					}
				});
			}
			/*________________________________________________________________________
			  * @Date:      		16 June 2015
			  * @Method :   		Delete Field 
			  * Created By: 		smartData Enterprises Ltd
			  * Modified On:		-
			  * @Purpose:   		to delete field.
			_________________________________________________________________________
			*/
		exports.deleteField = function(req, res) {
			if (req.body.id) {
				fieldObj.update({
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