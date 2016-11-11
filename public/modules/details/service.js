"use strict"
angular.module("Details")

.factory('DetailService', ['$http', 'communicationService', function($http, communicationService) {
	var service = {};
	service.addDetail = function(postData, callback) {
		communicationService.resultViaPost(webservices.AddDetail, headerConstants.json, postData, function(response) {
			callback(response.data);
		});
	}
	service.getDetail = function(postData,callback) {
			communicationService.resultViaPost(webservices.getDetail, headerConstants.json,postData,function(response) {
			callback(response.data);
		});
	}
	service.getShopDetail = function(postData, callback) {
		communicationService.resultViaPost(webservices.getShopDetail, headerConstants.json, postData, function(response) {
			callback(response.data);
		});
	}
	service.deleteDetail = function(postData, callback) {
		communicationService.resultViaPost(webservices.deleteDetail, headerConstants.json, postData, function(response) {
			callback(response.data);
		});
	}
	service.getLocation = function(callback) {
		communicationService.resultViaGet(webservices.getLocation, headerConstants.json, function(response) {
			callback(response.data);
		});
	}
	service.getState = function(postData, callback) {
		communicationService.resultViaPost(webservices.getState, headerConstants.json, postData, function(response) {
			callback(response.data);
		});
	}
	service.addFilter = function(postData, callback) {
		communicationService.resultViaPost(webservices.addFilter, headerConstants.json, postData, function(response) {
			callback(response.data);
		});
	}
	service.getFilter = function(postdata,callback) {
		communicationService.resultViaPost(webservices.getFilter, headerConstants.json, postdata,function(response) {
			callback(response.data);
		});
	}
	service.deleteFilter = function(postData, callback) {
		communicationService.resultViaPost(webservices.deleteFilter, headerConstants.json, postData, function(response) {
			callback(response.data);
		});
	}
	service.addField = function(postData, callback) {
		communicationService.resultViaPost(webservices.addField, headerConstants.json, postData, function(response) {
			callback(response.data);
		});
	}
	service.getField = function(postData,callback) {
		communicationService.resultViaPost(webservices.getField, headerConstants.json, postData,function(response) {
			callback(response.data);
		});
	}
	service.deleteField = function(postData, callback) {
		communicationService.resultViaPost(webservices.deleteField, headerConstants.json, postData, function(response) {
			callback(response.data);
		});
	}
	
	return service;
}]);