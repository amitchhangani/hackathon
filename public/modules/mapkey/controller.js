"use strict";
angular.module("mapkey");
shopifyApp.controller("mapkeyController", ['$scope', '$localStorage', '$location', '$stateParams', 'mapkeyService', '$timeout',
	function($scope, $localStorage, $location, $stateParams, mapkeyService, $timeout) {
		$scope.update = false;
		/*________________________________________________________________________
			   * @Date:      		21 June 2016
			   * @Method :   		Get google map api key
			   * Created By: 		smartData Enterprises Ltd
			   * Modified On:		-
			   * @Purpose:   		to display google map api key.
		_________________________________________________________________________*/
		$scope.id = $stateParams.id;
		mapkeyService.getmapkey(function(response) {
				if (response.messageId == 200) {
					$scope.key = {};
					$scope.update = true;
					$scope.key = response.data;
				} else {
					alert("Cannot get Response ");
				}
			})
			/*________________________________________________________________________
			   * @Date:      		17 June 2016
			   * @Method :   		Save google map api key
			   * Created By: 		smartData Enterprises Ltd
			   * Modified On:		21 June 
			   * @Purpose:   		to save google map api key.
			 ________________________________________________________________________*/
		$scope.addmapkey = function() {
			$scope.key.shop_id = $localStorage.id;
			if ($localStorage.id) {

				mapkeyService.addmapkey($scope.key, function(response) {
					if (response.messageId == 200) {
						$scope.showmessage = true;
						$scope.alerttype = "alert alert-success";
						$scope.message = response.message;
						$timeout(function(argument) {
							$scope.showmessage = false;
						}, 2000)


					} else {
						$scope.showmessage = true;
						$scope.alerttype = "alert alert-danger";
						$scope.message = response.message;
						$timeout(function(argument) {
							$scope.showmessage = false;
						}, 2000)
					}
				})
			} else {
				$location.path('/home');
			}
		};

		$scope.myVar = true;
		$scope.toggle = function() {
			$scope.myVar = !$scope.myVar;
		};
	}
]);