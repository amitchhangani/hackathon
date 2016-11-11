		var detailObj = require('./../../models/details/details.js');
		var filterObj = require('./../../models/filters/filters.js');
		var fieldObj = require('./../../models/fields/fields.js');
		var locationObj = require('./../../models/locations/locations.js');
		var locationObj = require('./../../models/locations/locations.js');
		var formidable = require('formidable');
		var fs = require('fs');
		var path = require('path');
		var csvjson = require('csvjson');
		var mongoose = require('mongoose');
		/*________________________________________________________________________
		   * @Date:      		22 June 2016
		   * @Method :   		Update data using csv file
		   * Created By: 		smartData Enterprises Ltd
		   * Modified On:		-
		   * @Purpose:   		To update data in details using csv files
		 ________________________________________________________________________*/
		exports.uploads = function(req, res) {
			var form = new formidable.IncomingForm();
			form.uploadDir = path.join(__dirname + './../../../public/doc/');
			form.keepExtensions = false;
			form.parse(req, function(err, fields, files) {
				fs.renameSync(files.file.path, form.uploadDir + files.file.name);
				var errFlag = false;
				try {
					var json = csvjson.toObject(form.uploadDir + files.file.name).output;
				} catch (err) {
					errFlag = true;
				}
				if (errFlag) {
					res.json({
						"status": "Failure",
						"messageId": 400,
						"message": "Invalid CSV file"
					})
				} else {
					var results = []
					var i;
					if (json.length > 0) {
						insertData(req, res, json, results, fields)
					} else {
						res.json({
							"status": "Failure",
							"messageId": 400,
							"message": "No data found, empty or invalid csv"
						})
					}
				}
			});
			var insertData = function(req, res, json, results, fields) {
				var newData = [];
				for (var i = 0; i < json.length; i++) {

					var temp = {};
					for (j in json[i]) {

						if (j == '"ID"' || j == 'ID') {
							temp._id = json[i][j];
						}
						if (j == '"StoreName"' || j == 'StoreName') {
							temp.store_name = json[i][j];
						}
						if (j == '"Address"' || j == 'Address') {
							temp.address = json[i][j];
						}
						if (j == '"City"' || j == 'City') {
							temp.city = json[i][j];
						}
						if (j == '"State"' || j == 'State') {
							temp.state = json[i][j];
						}
						if (j == '"Country"' || j == 'Country') {
							temp.country_name = json[i][j];

						}
						if (j == '"Postal"' || j == 'Postal') {
							temp.postal = json[i][j];
						}
						if (j == '"Fax"' || j == 'Fax') {
							temp.fax = json[i][j];
						}
						if (j == '"Email"' || j == 'Email') {
							temp.email = json[i][j];
						}
						if (j == '"Website"' || j == 'Website') {
							temp.website = json[i][j];
						}
						if (j == '"HoursOfOperation"' || j == 'HoursOfOperation') {
							temp.hours = json[i][j];
						}
						if (j == '"Latitude"' || j == 'Latitude') {
							temp.latitude = json[i][j];
						}
						if (j == '"Longitude"' || j == 'Longitude') {
							temp.longitude = json[i][j];
						}
						if (j.indexOf('Filter') != -1) {
							var filter = {}
							if (j.indexOf('"' != -1)) {
								j.substring(1, j.length - 1);
							}
							if (j.indexOf('"' != -1)) {
								j.substring(1, j.length - 1);
							}
							var temp_filter = j.split('_');
							filter.title = temp_filter[1];
							filter.value = json[i][j];
							temp.custom_filters = temp.custom_filters ? temp.custom_filters : [];
							temp.custom_filters.push(filter);
						}

						if (j.indexOf('Fields') != -1) {
							var field = {}
							if (j.indexOf('"' != -1)) {
								j.substring(1, j.length - 1);
							}
							if (j.indexOf('"' != -1)) {
								j.substring(1, j.length - 1);
							}
							var temp_field = j.split('_');
							field.field_name = temp_field[1];
							field.field_detail = json[i][j];
							temp.custom_fields = temp.custom_fields ? temp.custom_fields : [];
							temp.custom_fields.push(field);
						}
					}
					temp.custom_filters = temp.custom_filters ? temp.custom_filters : [];
					temp.custom_fields = temp.custom_fields ? temp.custom_fields : [];
					newData.push(temp)
				}

				if (newData.length > 0) {
					getCountryId(req, res, newData, 0, results, fields)
				} else {
					res.json({
						msg: 'no data'
					});
				}
			}


			var getCountryId = function(req, res, newData, i, results, fields) {

				if (newData[i].country_name) {
					locationObj.findOne({
							name: newData[i].country_name
						},
						function(errC, countryData) {
							if (errC) {
								callNext(req, res, newData, i, errC, fields);
							} else {

								if (countryData) {
									newData[i].country_id = countryData._id;
									if (newData[i].custom_filters.length > 0) {
										getFilterIds(newData, req, res, newData, results, i, fields, 0)
									} else if (newData[i].custom_fields.length > 0) {
										getFieldIds(newData, req, res, newData, results, i, fields, 0)
									} else {
										lastStep(newData, req, res, newData, results, i, fields)
									}
								} else {
									callNext(req, res, newData, i, 'Invalid country name', fields, results);
								}


							}
						});
				}
			}
			var callNext = function(req, res, newData, i, err, fields, results) {

				results.push({
					'store': newData[i].store_name,
					"status": "error",
					err: err
				})
				if (newData.length == i + 1) {
					res.json({
						"status": "success",
						"messageId": 200,
						"message": "conversion done successfully",
						"result": results
					})
				} else {
					getCountryId(req, res, newData, i + 1, results, fields)
				}
			}

			var getFilterIds = function(newData, req, res, json, results, i, fields, idIndex) {

				if (newData[i].custom_filters[idIndex].title) {
					console.log({
						filter: newData[i].custom_filters[idIndex].title,
						is_deleted: false,
						shop_id: fields.shop_id
					})
					filterObj.findOne({
						filter: newData[i].custom_filters[idIndex].title,
						is_deleted: false,
						shop_id: fields.shop_id
					}, function(errF, filterData) {
						if (errF) {
							callNext(req, res, newData, i, errF, fields, results);
						} else {

							if (filterData) {
								newData[i].custom_filters[idIndex].filter_id = filterData._id;
								if (newData[i].custom_filters.length > idIndex + 1) {
									getFilterIds(newData, req, res, json, results, i, fields, idIndex + 1)
								} else {
									if (newData[i].custom_fields.length != 0) {
										getFieldIds(newData, req, res, json, results, i, fields, 0)
									} else {
										lastStep(newData, req, res, json, results, i, fields)
									}
								}
							} else {
								callNext(req, res, newData, i, 'Invalid filter name', fields, results);
							}
						}
					})
				} else {
					callNext(req, res, newData, i, 'Invalid filter name', fields, results);
				}
			}


			var getFieldIds = function(newData, req, res, json, results, i, fields, idIndex) {

				if (newData[i].custom_fields[idIndex].field_name) {
					fieldObj.findOne({
						field: newData[i].custom_fields[idIndex].field_name,
						is_deleted: false,
						shop_id: fields.shop_id
					}, function(errF, fieldData) {
						if (errF) {
							callNext(req, res, newData, i, errF, fields, results);
						} else {
							if (fieldData) {
								newData[i].custom_fields[idIndex].field_id = fieldData._id;
								if (newData[i].custom_fields.length != idIndex + 1) {
									getFieldIds(newData, req, res, json, results, i, fields, idIndex + 1)
								} else {
									lastStep(newData, req, res, json, results, i, fields)
								}
							} else {
								callNext(req, res, newData, i, 'Invalid field name', fields, results);
							}
						}
					})
				} else {
					callNext(req, res, newData, i, 'Invalid field name', fields, results);
				}
			}


			var lastStep = function(newData, req, res, json, results, i, fields) {

				detailObj.findOne({
					shop_id: fields.shop_id,
					store_name: newData[i].store_name,
					is_deleted: false
				}, function(err, stores) {
					if (err) {
						callNext(req, res, newData, i, err, fields, results);
					} else {
						if (stores) {
							callNext(req, res, newData, i, 'A store with same name already exists', fields, results);
						} else {

							if (newData[i]._id) {
								var id = newData[i]._id;
								delete newData[i]._id;
								detailObj.update({
									_id: id,
									shop_id: fields.shop_id
								}, {
									$set: newData[i]
								}, {
									upsert: false
								}, function(err, result) {
									if (err) {
										results.push({
											'store': newData[i].store_name,
											"status": "error",
											err: err
										})
									} else {
										results.push({
											'store': newData[i].store_name,
											"status": "success"
										})
									}
									if (i == json.length - 1) {
										res.json({
											"status": "success",
											"messageId": 200,
											"message": "conversion done successfully",
											"result": results
										})
									} else {
										getCountryId(req, res, newData, i + 1, results, fields);
									}
								});
							} else {
								delete newData[i]._id;
								newData[i].shop_id = fields.shop_id;
								var detailAdd = new detailObj(newData[i]);
								detailAdd.save(function(err, data) {
									if (err) {
										results.push({
											'store': newData[i].store_name,
											"status": "error",
											err: err
										})
									} else {
										results.push({
											'store': newData[i].store_name,
											"status": "success"
										})
									}
									if (i == newData.length - 1) {
										res.json({
											"status": "success",
											"messageId": 200,
											"message": "conversion done successfully",
											"result": results
										})
									} else {
										getCountryId(req, res, newData, i + 1, results, fields);
									}
								});
							}

						}

					}

				})
			}
		}