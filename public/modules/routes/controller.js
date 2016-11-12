"use strict"
hackathon.controller("routesController", [ '$scope','$http','$state','$rootScope','NgMap','GeoCoder', 'NgTableParams', 'toaster',function($scope, $http, $state, $rootScope, NgMap, GeoCoder, NgTableParams, toaster) {
	//alert('cityController');
	$scope.map = {};
	$scope.vehicleList = {};
	$scope.location = {};
	$scope.vehicle = {};
	$scope.wayPoints = [
          /*{location: {lat:44.32384807250689, lng: -78.079833984375}, stopover: true},
          {location: {lat:44.55916341529184, lng: -76.17919921875}, stopover: true},*/
        ];
    $scope.markers = {};

	/*
     * show routes using google map api provided the user vehicle.
     * 
	 */
	$scope.showRoute = function(){
		//
		if($scope.vehicle.vehicleId) {
			$http.get('/fetchCollectionCenters?vehicleId=' + $scope.vehicle.vehicleId).then(function(response) {
				$scope.markers = {};
				console.info($scope.markers);
				if(response.data.status == 1) {
					
				} else {
					toaster.pop('error', "Oops something went wrong.", response.data.message);
				}
			});
		} else {
			$http.get('/fetchCollectionCenters').then(function(response) {
				if(response.data.status == 1) {
					$scope.markers = response.data.data;
					console.info($scope.markers);
				} else {
					toaster.pop('error', "Oops something went wrong.", response.data.message);
				}
			});
		}
	}
	
	
	/*init ng-tables*/
	$scope.getAllVehicles = function(){
		$scope.showRoute();
		$http.get('/fetchvehicles').then(function(response) {
			if(response.data.status == 1) {
				$scope.vehicleList = response.data.data;
			} else {
				toaster.pop('error', "Oops something went wrong.", "error while getting vehicles, try again in sometime, while we are fixing the problem.");
			}
		});
	}
	

	NgMap.getMap().then(function(map) {
		$scope.map = map;
	});

}])