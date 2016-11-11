"use strict";
angular.module("payment")
shopifyApp.controller("paymentCtrl", ['$window', '$scope', '$rootScope', '$localStorage', 'paymentService', '$timeout', '$stateParams', '$location', function($window, $scope, $rootScope, $localStorage, paymentService, $timeout, $stateParams, $location) {
	console.log("id check:", $stateParams.id);
	$scope.paymentData;
	$scope.planTwo = function() {
		var inputJson = {
			"recurring_application_charge": {
				"name": "Intermediate",
				"price": 9.99,
				"return_url": "https:\/\/localhost:5513\/payment\/confirm",
				"test": true,
				"trial_days": 10
			},
			"shopId": $stateParams.id
		};

		paymentService.createCharge(inputJson, function(response) {
			if (response.messageId == 200) {
				console.log("response:", response);
				top.window.location.href = response.data.recurring_application_charge.confirmation_url;

			} else {
				$scope.showmessage = true;
				$scope.alerttype = "alert alert-danger";
				$scope.message = response.message;


			}
		})
	}
	$scope.planThird = function() {
		var inputJson = {
			"recurring_application_charge": {
				"name": "Advanced",
				"price": 19.99,
				"return_url": "https:\/\/localhost:5513\/payment\/confirm",
				"test": true,
				"trial_days": 10
			},
			"shopId": $stateParams.id
		};

		paymentService.createCharge(inputJson, function(response) {
			if (response.messageId == 200) {
				console.log("response:", response);
				top.window.location.href = response.data.recurring_application_charge.confirmation_url;
			} else {
				$scope.showmessage = true;
				$scope.alerttype = "alert alert-danger";
				$scope.message = response.message;

			}
		})
	}
	$scope.paymentDetails = function() {
		if ($stateParams.id) {
			var input = {
				shop_id: $stateParams.id
			}
			paymentService.getPaymentDetails(input, function(response) {
				if (response.messageId == 200) {
					$scope.paymentData = response.data;
					$scope.showmessage = true;
					$scope.alerttype = "alert alert-success"
					$scope.message = "Your current plan : " + response.data.plan;
				}
				if (response.messageId == 401) {
					$scope.showmessage = true;
					$scope.alerttype = "alert alert-warning"
					$scope.message = "Currently you are using free plan.";
				} else {
					if (response.data.shop_Id.payment_recieved == false) {
						$scope.showmessage = true;
						$scope.alerttype = "alert alert-warning"
						$scope.message = "Currently you are using free plan.";
					}

				}
			})

		}
	}
}]);