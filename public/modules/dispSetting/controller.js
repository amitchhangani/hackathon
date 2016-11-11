"use strict";

angular.module("dispSetting", ['colorpicker.module', 'ngMap']);
shopifyApp.controller("dispSettingController", ['$scope', '$localStorage', 'NgMap', '$stateParams', '$rootScope', '$location', 'dispSettingService', '$timeout',
	function($scope, $localStorage, $rootScope, $stateParams, NgMap, $location, dispSettingService, $timeout) {
		
		$scope.id = $stateParams.id;
		/*________________________________________________________________________
		   * @Date:      		18 June 2015
		   * @Method :   		Add setting
		   * Created By: 		smartData Enterprises Ltd
		   * Modified On:		-
		   * @Purpose:   		To add a new setting
		 _________________________________________________________________________
		 */
		$scope.addSetting = function() {
			$scope.info.shop_id = $localStorage.id;
			if ($localStorage.id) {
				if ($scope.info.color) {
					$scope.info.color = $scope.info.color.slice(1, $scope.info.color.length);
				}
				$scope.info.map_address = [map.getCenter().lat(), map.getCenter().lng()];
				$scope.info.map_zoom = map.getZoom()
				dispSettingService.updateSettings($scope.info, function(response) {
					if (response.messageId == 200) {
						$location.path('/home')
					} else {
						alert("Wrong details! Please recheck your data and try again. ");
					}
				})
			}
		};
		var map;
		$scope.$on('mapInitialized', function(event, evtMap) {
			map = evtMap;
			dispSettingService.getSetting(function(response) {
				console.log(response)
				if (response.messageId == 200) {
					console.log("response.data is", response.data);
					$scope.info = response.data;
					//$scope.info.map_address = [$scope.info.map_coords.latitude, $scope.info.map_coords.longitude];
					//console.log($scope.info.map_address)
					map.setZoom($scope.info.map_zoom);
					$scope.info.map_load = response.data.map_load;
				} else {
					alert("Cannot get Response ");
				}
			})
		});

		// $scope.centerChanged = function() {
		// 		//alert($scope.info.map_zoom )
		// 		console.log("typeof:",typeof(map));
		// 		if (typeof(map) == 'undefined') {
		// 			var a = map.getCenter();
		// 			console.log(a.lat());
		// 		}

		// 	}
			/*________________________________________________________________________
			   * @Date:      		18 June 2015
			   * @Method :   		Display setting
			   * Created By: 		smartData Enterprises Ltd
			   * Modified On:		-
			   * @Purpose:   		To display settings
			   * @Return:    	 	yes
			 _________________________________________________________________________ */
		
		
	}
]);