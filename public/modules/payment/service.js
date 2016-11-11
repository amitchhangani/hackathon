"use strict"
angular.module("payment")
	.factory('paymentService', ['$http', 'communicationService', function($http, communicationService) {
		var service = {};
		service.createCharge = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.planCharge, headerConstants.json, inputJsonString, function(response) {
				callback(response.data);
			});
		}
		service.getPaymentDetails = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.paymentDetails, headerConstants.json, inputJsonString, function(response) {
				callback(response.data);
			});
		}

		return service;
	}]);