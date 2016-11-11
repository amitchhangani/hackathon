"use strict"
angular.module("dispSetting")
.factory('dispSettingService', ['$http', 'communicationService', function($http, communicationService) {
	var service = {};
	service.updateSettings = function(postData, callback) {
		communicationService.resultViaPost(webservices.updateSettings, headerConstants.json, postData, function(response) {
			callback(response.data);
		});
	}
	service.getSetting = function(callback) {
		communicationService.resultViaGet(webservices.getSetting, headerConstants.json,  function(response) {
			callback(response.data);
		});
	}
	return service;
}]);