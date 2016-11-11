		var locationObj = require('./../../models/locations/locations.js');
		var mongoose = require('mongoose');
		/*________________________________________________________________________
		   * @Date:      		14 June 2015
		   * @Method :   		Display Countries
		   * Created By: 		smartData Enterprises Ltd
		   * Modified On:		-
		   * @Purpose:   		to get the list of countries names.
		   * @Return:    	 	yes
		 _________________________________________________________________________
		 */
		exports.getLocation = function(req, res) {
				locationObj.find({
					"parent_id": 0
				}).sort({name:1}).exec(function(err, data) {
					if (err) {
						return res.json({
							status: 400,
							message: err
						});
					} else {
						return res.json({
							'status': 200,
							'message': 'success',
							'data': data
						});
					}
				});
			}
			/*________________________________________________________________________
			   * @Date:      		14 June 2015
			   * @Method :   		Display States
			   * Created By: 		smartData Enterprises Ltd
			   * Modified On:		-
			   * @Purpose:   		to get the list of states names.
			   * @Return:    	 	yes
			 _________________________________________________________________________
			 */
		exports.getState = function(req, res) {
			if (req.body.country_id) {
				var id = req.body.country_id;
				locationObj.find({
					parent_id: id
				}).sort({name:1}).exec(function(err, data) {
					if (err) {
						return res.json({
							status: 400,
							message: err
						});
					} else {
						return res.json({
							status: 200,
							message: 'success',
							data: data
						});
					}
				});
			} else {
				return res.json({
					status: 400,
					message: "Invalid country id"
				});
			}
		}