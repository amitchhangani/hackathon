"use strict"
angular.module("groups")
.factory('groupService', ['$http', 'communicationService', function($http, communicationService) {
	var service = {};
	service.addGroup = function(inputJsonString, callback) {
		console.log("in service");
		communicationService.resultViaPost(webservices.addGroup, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}
	service.fetchGroups = function(inputJsonString, callback) {
		console.log("in service");
		communicationService.resultViaPost(webservices.fetchGroups, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}
	service.editGroup = function(inputJsonString, callback) {
		console.log("in service");
		communicationService.resultViaPost(webservices.editGroup, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}
	service.deletGroup = function(inputJsonString, callback) {
		console.log("in service");
		communicationService.resultViaPost(webservices.deletGroup, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}
	return service;
}]);