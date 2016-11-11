"use strict"
angular.module("main")
.factory('mainService', ['$http', 'communicationService', function($http, communicationService) {
	var service = {};
	service.logout = function(callback) {
		communicationService.resultViaGet(webservices.logout, headerConstants.json, function(response) {
			callback(response.data);
		});
	}
	
	service.bulkExport = function(inputJsonString, callback) {
		communicationService.resultViaPost(webservices.bulkExport, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}
	return service;
}]);