		var detailObj = require('./../../models/details/details.js');
		var configObj = require('./../../../constants.js');
		var groupObj = require('./../../models/groups/groups.js');
		var searchedLocObj = require('./../../models/searchedLocations/searchLocations.js');
		var moment = require('moment');
		var paymenObj = require('./../../models/payment/payment.js');
		var mongoose = require('mongoose');
		var json2csv = require('json2csv');
		var path = require('path');
		var fs = require('fs')
			/*________________________________________________________________________
			   * @Date:      		13 June 2016
			   * @Method :   		Add Store 
			   * Created By: 		smartData Enterprises Ltd
			   * Modified On:		-
			   * @Purpose:   		To add a new store.
			 _________________________________________________________________________
			 */
		exports.addDetail = function(req, res) {
				var errorMessage = "";
				if (req.body.store_name && req.body.address && req.body.city && req.body.country) {
					var data = req.body;
					var i = 0;
					if (data.filters && data.filters.length > 0) {
						data.custom_filters = []
						for (i = 0; i < data.filters.length; i++) {
							var temp = {};
							temp.filter_id = data.filters[i]._id;
							temp.title = data.filters[i].filter;
							temp.value = data.filters[i].value ? data.filters[i].value : false;
							data.custom_filters[i] = temp;
						}
					}
					if (data.fields && data.fields.length > 0) {
						data.custom_fields = []
						for (i = 0; i < data.fields.length; i++) {
							var temp = {};
							temp.field_id = data.fields[i]._id;
							temp.field_name = data.fields[i].field;
							temp.field_detail = data.fields[i].description ? data.fields[i].description : "";
							data.custom_fields[i] = temp;
						}
					}
					data.country = JSON.parse(data.country);
					data.country_id = data.country._id;
					data.country_name = data.country.name;
					if (!data._id) {
						var detailAdd = new detailObj(data);
						detailObj.findOne({
							shop_id: req.body.shop_id,
							store_name: req.body.store_name,
							is_deleted: false
						}).exec(function(error, result) {
							if (error) {
								res.status(400).json({
									status: 'failure',
									messageId: 400,
									message: error
								});
							}
							if (!result) {
								detailAdd.save(function(err, data) {
									if (!err) {

										res.status(200).json({
											status: 'Success',
											messageId: 200,
											message: configObj.storeAdded
										});

									} else {
										switch (err.name) {
											case 'ValidationError':
												for (field in err.errors) {
													if (errorMessage == "") {
														errorMessage = err.errors[field].message;
													} else {
														errorMessage += "\r\n" + err.errors[field].message;
													}
												} //for
												break;
											case 'MongoError':
												errorMessage =configObj.duplicateStoreName
												break;
										} //switch
										res.status(400).json({
											'status': 'Faliure',
											'messageId': 400,
											'message': errorMessage
										});
									}
								});
							} else {
								res.status(400).json({
									'status': 'Faliure',
									'messageId': 400,
									'message': configObj.duplicateStoreName
								});
							}
						});



					} else {
						var id = data._id;
						delete data._id;
						detailObj.update({
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
									message: configObj.storeUpdate
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
						message: configObj.missingDetails
					});
				}
			}
			/*________________________________________________________________________
		   * @Date:      		13 June 2016
		   * @Method :   		Display Store 
		   * Created By: 		smartData Enterprises Ltd
		   * Modified On:		-
		   * @Purpose:   		To display stores.
		   * @Return:    	 	yes
		 _________________________________________________________________________
		 */
		exports.getDetail = function(req, res) {
			console.log("req.body:", JSON.stringify(req.body));
			detailObj.find({
				shop_id: req.body.id,
				is_deleted: false
			}, function(err, data) {
				if (err) {
					return res.json({
						status: 400,
						message: err
					});
				} else {
					return res.json({
						status: 'success',
						messageId: 200,
						data: data
					});

				}
			});
		}

		/*________________________________________________________________________
		* @Date:      		16 June 2015
		* @Method :   		Delete Store 
		* Created By: 		smartData Enterprises Ltd
		* Modified On:		-
		* @Purpose:   		To delete a store.
		* @Param:     		1
		* @Return:    	 	yes
		_________________________________________________________________________
		*/
		exports.deleteDetail = function(req, res) {
			if (req.body.id) {
				detailObj.update({
					_id: req.body.id,
					shop_id: req.body.shop_id
				}, {
					$set: {
						is_deleted: true
					}
				}, {}, function(err) {

					if (!err) {

						res.status(200).json({
							status: 'Success',
							messageId: 200,
							message: configObj.storeDelete
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



		/*________________________________________________________________________
				   * @Date:      		16 June 2015
				   * @Method :   		showStore details
				   * Created By: 		smartData Enterprises Ltd
				   * Modified On:		-
				   * @Purpose:   		To load store data.
				   * @Param:     		0
				   * @Return:    	 	yes
				 _________________________________________________________________________
				 */
		exports.getShopDetail = function(req, res) {
			if (req.body.id) {
				detailObj.findOne({
						_id: req.body.id
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
					}).populate('country_id')
			} else {
				res.status(400).json({
					status: 'Faliure',
					messageId: 400,
					message: 'No Valid Id'
				});
			}
		}

		/*________________________________________________________________________
		* @Date:      		16 June 2015
		* @Method :   		bulkExport 
		* Created By: 		smartData Enterprises Ltd
		* Modified On:		-
		* @Purpose:   		Export all stores to csv.
		* @Param:     		1
		* @Return:    	 	yes
		_________________________________________________________________________
		*/
		exports.bulkExport = function(req, res) {
				if (req.body.id && req.session.shopLogin) {
					if (req.session.shopLogin._id == req.body.id) {
						if (req.session.shopLogin.payment_recieved) {
							paymenObj.find({
								shop_Id: mongoose.Types.ObjectId(req.body.id),
								is_deleted: false
							}).lean().exec(function(err, paymentData) {
								if (paymentData.length > 0) {
									detailObj.find({
										shop_id: mongoose.Types.ObjectId(req.session.shopLogin._id),
										is_deleted: false
									}, function(err1, stores) {
										if (!err1) {
											if (stores.length > 0) {
												var i, j, k = 0;
												var fields = ['ID',
													'StoreName',
													'Address',
													'City',
													'State',
													'Country',
													'Postal',
													'Fax',
													'Email',
													'Website',
													'HoursOfOperation',
													'Latitude',
													'Longitude',
												];
												var parsedData = [];
												for (var i = 0; i < stores.length; i++) {
													var temp = {};
													temp.ID = stores[i]._id;
													temp.StoreName = stores[i].store_name;
													temp.Address = stores[i].address;
													temp.City = stores[i].city;
													temp.State = stores[i].state;
													temp.Country = stores[i].country_name;
													temp.Postal = stores[i].postal;
													temp.Fax = stores[i].fax;
													temp.Email = stores[i].email;
													temp.Website = stores[i].website;
													temp.HoursOfOperation = stores[i].hours;
													temp.Latitude = stores[i].latitude;
													temp.Longitude = stores[i].longitude;
													for (j = 0; j < stores[i].custom_fields.length; j++) {
														fields.push('Fields_' + stores[i].custom_fields[j].field_name)
														temp['Fields_' + stores[i].custom_fields[j].field_name] = stores[i].custom_fields[j].field_detail;
													}
													for (k = 0; k < stores[i].custom_filters.length; k++) {
														fields.push('Filter_' + stores[i].custom_filters[k].title);
														temp['Filter_' + stores[i].custom_filters[k].title] = stores[i].custom_filters[k].value;
													}
													parsedData[i] = temp;
												}
												console.log(JSON.stringify(parsedData));
												console.log(JSON.stringify(fields));
												json2csv({
													data: parsedData,
													fields: fields
												}, function(err2, csv) {
													var storeCsv = req.session.shopLogin._id + '_stores.csv';
													if (err2) {
														res.status(400).json({
															status: 'Faliure',
															messageId: 400,
															message:configObj.errorMessage,
															error: err2
														});
													} else {
														var pathdata = path.join(__dirname + './../../../public/storesCsv/' + storeCsv);
														fs.writeFile(pathdata, csv, function(err3) {
															if (err3) {
																res.status(400).json({
																	status: 'Faliure',
																	messageId: 400,
																	message:configObj.errorMessage,
																	error: err3
																});
															} else {
																res.status(200).json({
																	status: 'success',
																	messageId: 200,
																	data: storeCsv
																});
															}
														});
													}
												});

											} else {
												res.status(400).json({
													status: 'Faliure',
													messageId: 400,
													message: configObj.addStores,
													error: err1
												});
											}
										} else {
											res.status(400).json({
												status: 'Faliure',
												messageId: 400,
												message: configObj.errorMessage,
												error: err1
											});
										}
									})
								} else {
									res.status(400).json({
										status: 'Faliure',
										messageId: 400,
										message:configObj.paidError
									});
								}
							})
						} else {
							res.status(400).json({
								status: 'Faliure',
								messageId: 400,
								message:configObj.paidError
							});
						}


					} else {
						res.status(400).json({
							status: 'Faliure',
							messageId: 400,
							message:configObj.loggedIn
						});
					}
				} else {
					res.status(400).json({
						status: 'Faliure',
						messageId: 400,
						message: configObj.inavlidId
					});
				}
			}
			/*________________________________________________________________________
					   * @Date:      		18 June 2015
					   * @Method :   		get store group details
					   * Created By: 		smartData Enterprises Ltd
					   * Modified On:		-
					   * @Purpose:   		To fetch store  group data.
					   * @Param:     		0
					   * @Return:    	 	yes
					 _________________________________________________________________________
					 */
		exports.fetchGroups = function(req, res) {
				var outputJson = {};
				
				groupObj.find({
					$or: [{
						shop_id: req.body.shop_id,
						is_deleted: false
					}, {
						_id: "576b7cf10eaad93ee3dec535"
					}]

				}).sort({
					group_name: 1
				}).exec(function(err, data) {
					if (err) {
						outputJson = {
							"status": "failure",
							"messageId": 400,
							"mesage": err
						}
						return res.jsonp(outputJson);
					} else {
						outputJson = {
							"status": "success",
							"messageId": 200,
							"data": data
						}
						return res.jsonp(outputJson);

					}
				})
			}
			/*________________________________________________________________________
						   * @Date:      		18 June 2015
						   * @Method :   		delete store group details
						   * Created By: 		smartData Enterprises Ltd
						   * Modified On:		-
						   * @Purpose:   		To delete store  group data.
						   * @Param:     		0
						   * @Return:    	 	yes
						 _________________________________________________________________________
						 */
		exports.remove = function(req, res) {
				var outputJson = {};
				
				groupObj.update({
					_id: req.body._id,
					shop_id: req.body.shop_id
				}, {
					$set: {
						is_deleted: true
					}
				}).exec(function(err, data) {
					if (err) {
						outputJson = {
							"status": "failure",
							"messageId": 400,
							"mesage": err
						}
						return res.jsonp(outputJson);
					} else {
						outputJson = {
							"status": "success",
							"messageId": 200,
							"message": configObj.groupDelete
						}
						return res.jsonp(outputJson);
					}
				})

			}
			/*________________________________________________________________________
        * @Date:      		18 June 2015
        * @Method :   		update store group details
        * Created By: 		smartData Enterprises Ltd
        * Modified On:		-
        * @Purpose:   		To update store  group data.
        * @Param:     		0
        * @Return:    	 	yes
        _________________________________________________________________________
        */
		exports.editGroup = function(req, res) {
				var outputJson = {};
				var queryString = {};
				if (req.body.hide) {
					queryString.hide = req.body.hide;

				}
				if (req.body.never) {
					queryString.never = req.body.never;

				}
				queryString.color = req.body.color;
				queryString.group_name = req.body.group_name;
				console.log("body data :", JSON.stringify(req.body));
				groupObj.update({
					_id: req.body.group_id,
					shop_id: req.body.shop_id
				}, {
					$set: queryString
				}).exec(function(err, data) {
					if (err) {
						outputJson = {
							"status": "failure",
							"messageId": 400,
							"mesage": err
						}
						return res.jsonp(outputJson);
					} else {
						outputJson = {
							"status": "success",
							"messageId": 200,
							"message": configObj.updateGroup
						}
						return res.jsonp(outputJson);
					}
				})
			}
			/*________________________________________________________________________
					   * @Date:      		16 June 2016
					   * @Method :   		Delete Store 
					   * Created By: 		smartData Enterprises Ltd
					   * Modified On:		-
					   * @Purpose:   		To delete stores.
			 _______________________________________________________________________ */
		exports.deleteDetail = function(req, res) {

				if (req.body.id) {
					detailObj.update({
						_id: req.body.id,
						shop_id: req.body.shop_id
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
			/*________________________________________________________________________
					   * @Date:      		16 June 2016
					   * @Method :   		Update Store 
					   * Created By: 		smartData Enterprises Ltd
					   * Modified On:		-
					   * @Purpose:   		To update a store.
					   * @Return:    	 	yes
			__________________________________________________________________*/
		exports.getShopDetail = function(req, res) {
			if (req.body.id) {
				detailObj.findOne({
						_id: req.body.id
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
					}).populate('country_id')
			} else {
				res.status(400).json({
					status: 'Faliure',
					messageId: 400,
					message: 'No Valid Id'
				});
			}
		}

		/*________________________________________________________________________
		   * @Date:      		18 June 2016
		   * @Method :   		Add Group
		   * Created By: 		smartData Enterprises Ltd
		   * Modified On:		-
		   * @Purpose:   		To add a new group.
		 _________________________________________________________________________
		 */
		exports.addGroup = function(req, res) {
			console.log("body:", JSON.stringify(req.body));
			var errorMessage = "";


			var saveGroup = new groupObj(req.body);
			groupObj.findOne({
				shop_id: req.body.shop_id,
				group_name: req.body.group_name,
				is_deleted: false
			}).exec(function(err, data) {
				if (err) {
					res.status(400).json({
						'status': 'Faliure',
						'messageId': 400,
						'message': err
					});
				}
				if (!data) {
					saveGroup.save(function(err1, data1) {
						if (err1) {
							console.log("error:", err1);
							switch (err1.name) {
								case 'ValidationError':
									for (field in err1.errors) {
										if (errorMessage == "") {
											errorMessage = err1.errors[field].message;
										} else {
											errorMessage += "\r\n" + err1.errors[field].message;
										}
									} //for
									break;
								case 'MongoError':
									errorMessage = "Duplicate group name."
									break;
							} //switch
							res.status(400).json({
								'status': 'Faliure',
								'messageId': 400,
								'message': errorMessage
							});

						} else {
							console.log("data group:", data);
							res.status(200).json({
								status: 'success',
								messageId: 200,
								message: 'Store group added successfully.'
							});
						}
					})
				} else {
					res.status(400).json({
						'status': 'Faliure',
						'messageId': 400,
						'message': "Duplicate group name."
					});
				}
			})


		}

		exports.getAlllocations = function(req, res) {
			var outputJson = {};
			console.log("in location api");
			var count = req.body.limit || 1000;
			var query = {};
			var miles;

			console.log("data recieved:", JSON.stringify(req.body));
			if (!req.body.filters && !req.body.currentLocation && !req.body.distance) {
				query.shop_id = mongoose.Types.ObjectId(req.body.shop_data._id);
				query.is_deleted = false;
			}
			if (req.body.unit == 'KM') {
				miles = parseInt(req.body.distance * 0.621371);
			} else {
				miles = parseInt(req.body.distance);
			}

			if (req.body.filters && req.body.currentLocation) {
				console.log("in filters");
				if (req.body.filters.length > 0) {
					console.log("in filters1");

					query = {
						"shop_id": mongoose.Types.ObjectId(req.body.shop_data._id),
						"custom_filters.title": {
							$in: req.body.filters
						},
						"custom_filters.value": {
							$ne: false
						},
						"location": {
							$geoWithin: {
								$centerSphere: [
									
										req.body.currentLocation.pos[0], req.body.currentLocation.pos[1]
									,
									miles / 3963.2
								]
							}
						},
						is_deleted: false
					};

				}
			}



			if (req.body.currentLocation && !req.body.filters) {
				query = {
					"shop_id": mongoose.Types.ObjectId(req.body.shop_data._id),
					"location": {
						$geoWithin: {
							$centerSphere: [
								
									req.body.currentLocation.pos[0], req.body.currentLocation.pos[1]
								,
								miles / 3963.2
							]
						}
					},
					is_deleted: false
				}

			}
			if (req.body.filters && !req.body.currentLocation) {
				query = {
					"shop_id": mongoose.Types.ObjectId(req.body.shop_data._id),
					"custom_filters.title": {
						$in: req.body.filters
					},
					"custom_filters.value": {
						$ne: false
					},
					is_deleted: false
				};
			}



			console.log("query gone:", JSON.stringify(query))

			detailObj.find(query).populate('group_name').limit(count).sort({
				store_name: 1
			}).exec(function(err, data) {
				if (err) {
					console.log("error:", err);
					outputJson = {
						"status": "failure",
						"messageId": 400,
						"message": "error in loading stores data."
					}
				} else {
					var finalData = [];
					console.log("response after query:", JSON.stringify(data));

					var dataLength = data.length;
					for (var i = 0; i < dataLength; i++) {
						if (data[i].group_name.hide != 'N/A') {
							var createdDate = moment(data[i].group_name.created_at);
							var addedDate = moment(data[i].group_name.created_at).add(parseInt(data[i].group_name.hide), 'days');
							console.log("moment of created date:", moment(createdDate));
							console.log("after adding days:", moment(addedDate));
							if (createdDate <= addedDate) {
								console.log("group hide date is not over")
								finalData.push(data[i]);
							}
						} else {
							finalData.push(data[i]);
						}
					}
					outputJson = {
						"status": "success",
						"messageId": 200,
						"data": finalData
					}
				}
				return res.jsonp(outputJson);
			})
		}
		exports.searchedPlaces = function(req, res) {
			var outputJson = {};
			searchedLocObj.find({
				shop_id: req.body.shop_id,
				is_deleted: false
			}).exec(function(err, data) {
				if (err) {
					outputJson = {
						"status": "failure",
						"messageId": 400,
						"message": "Error in getting data."
					}
				} else {
					outputJson = {
						"status": "success",
						"messageId": 200,
						"data": data
					}
				}
				return res.jsonp(outputJson);
			})
		}