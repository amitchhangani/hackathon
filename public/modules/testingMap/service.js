"use strict"
angular.module("map")
	.factory('mapService', ['$http', 'communicationService', function($http, communicationService) {
		var service = {};
		service.getFilters = function(callback) {
			communicationService.resultViaGet(webservices.getFilters, headerConstants.json, function(response) {
				callback(response.data);
			});
		}
		service.getLocations = function(postData, callback) {
			communicationService.resultViaPost(webservices.getAllStoresLoc, headerConstants.json, postData, function(response) {
				callback(response.data);
			});
		}
		service.getDisplaySetting = function(postData, callback) {
			communicationService.resultViaPost(webservices.getSettings, headerConstants.json, postData, function(response) {
				callback(response.data);
			});
		}
		service.getMapKey = function(postData, callback) {
			communicationService.resultViaPost(webservices.getMapKey, headerConstants.json, postData, function(response) {
				callback(response.data);
			});
		}
		return service;
	}]);