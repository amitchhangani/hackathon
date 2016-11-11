"use strict"
angular.module("mapkey")
	.factory('mapkeyService', ['$http', 'communicationService', function($http, communicationService) {
		var service = {};
		service.addmapkey = function(postData, callback) {
			communicationService.resultViaPost(webservices.addmapkey, headerConstants.json, postData, function(response) {
				callback(response.data);
			});
		}
		service.getmapkey = function(callback) {
			communicationService.resultViaGet(webservices.getmapkey, headerConstants.json, function(response) {
				callback(response.data);
			});
		}
		return service;
	}]);