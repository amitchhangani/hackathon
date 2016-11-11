"use strict";
angular.module("home")
shopifyApp.controller("homeController", ['$window', '$scope', '$rootScope', '$localStorage', 'homeService', '$timeout', function($window, $scope, $rootScope, $localStorage, homeService, $timeout) {
	$scope.auth = function() {
	
		inputJson.shop = $scope.name;
		inputJson.webHook = false;
		
		window.localStorage.setItem('shopName', $scope.name);
		var patt = new RegExp(/^[a-zA-Z0-9 .!?"-]+$/);
		if (patt.test($scope.name)) {
			homeService.getAuth(inputJson, function(response) {
				if (response.messageId == 200) {
					if (response.data.nonce == inputJson.nonce) {
						console.log("success");
						
						$window.location.href = response.auth_url;
					} else {
						$scope.showmessage = true;
						$scope.alerttype = "alert alert-danger";
						$scope.message = "Unauthorized";
						$timeout(function(argument) {
							$scope.showmessage = false;
						}, 2000)
					}
				}
			})
		} else {
			$scope.showmessage = true;
			$scope.alerttype = "alert alert-danger";
			$scope.message = "Please enter valid shop name.";
			$timeout(function(argument) {
				$scope.showmessage = false;
			}, 2000)
			window.localStorage.setItem('shopName', '');
		}
	}
}]);