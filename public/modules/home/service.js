"use strict"
angular.module("home")
.factory('homeService', ['$http', 'communicationService', function($http, communicationService) {
	var service = {};
	service.getAuth = function(inputJsonString, callback) {
		console.log("in service");
		communicationService.resultViaPost(webservices.auth, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}
	return service;
}]);