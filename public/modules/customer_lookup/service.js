"use strict"
angular.module("lookup")
.factory('lookupService', ['$http', 'communicationService', function($http, communicationService) {
		var service = {};
		service.fetchCircles = function(postData,callback) {
			communicationService.resultViaPost(webservices.getLookup, headerConstants.json,postData, function(response) {
				callback(response.data);
			});
		}


		return service;
	}]);