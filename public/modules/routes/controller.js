"use strict"
hackathon.controller("routesController", [ '$scope','$http','$state','$rootScope','NgMap','GeoCoder', 'NgTableParams', 'toaster',function($scope, $http, $state, $rootScope, NgMap, GeoCoder, NgTableParams, toaster) {
	//alert('cityController');
	$scope.map = {};
	$scope.vehicleList = {};
	$scope.location = {};
	$scope.vehicle = {};
	$scope.travelMode = "DRIVING";
	$scope.wayPoints = [];
    $scope.showDirection = false;
    $scope.markers = [];
    $scope.collectionCentersFlag = false;
    $scope.dumpyards = [];
    $scope.dumpyardsFlag = false;
    $scope.markersFlag = false;

	/*
     * show routes using google map api provided the user vehicle.
     * 
	 */
	$scope.showRoute = function(){
		if($scope.vehicle.vehicleId >= 0 && $scope.vehicle.vehicleId != '' && $scope.vehicle.vehicleId != undefined) {
		$scope.wayPoints = []; 
			if($scope.vehicleWithDumpyard[$scope.vehicle.vehicleId].dumpyards) {
				toaster.pop('success', "Everything's looking great :)", "please hold your breadth while we get your routes.");
				angular.forEach($scope.vehicleWithDumpyard[$scope.vehicle.vehicleId].collectionCenters, function(v, k) {
				//console.log('here...');
					$scope.wayPoints.push({location: {lat: Number(v.lat), lng: Number(v.long)}, stopover: true});
				});
				$scope.origin = $scope.vehicleWithDumpyard[$scope.vehicle.vehicleId].dumpyards.name;
				$scope.destination = $scope.vehicleWithDumpyard[$scope.vehicle.vehicleId].dumpyards.name;
				$scope.showDirection = true;
				$scope.dumpyardsFlag = false;
	    		$scope.markersFlag = false;
			} else {
				$scope.dumpyardsFlag = true;
    			$scope.markersFlag = true;
    			$scope.wayPoints = [];
    			$scope.destination = false;
    			$scope.showDirection = false;
				toaster.pop('warning', "Dumpyard is missing.", "we did not find any dumping zone for you, please contact admin.");
			}
		} else {
			toaster.pop('warning', "Please select vehicle.", "you need to select a vehicle to optimize the route buddy :)");
			$scope.dumpyardsFlag = true;
    		$scope.markersFlag = true;
    		$scope.wayPoints = [];
    		$scope.destination = false;
    		$scope.showDirection = false;
		}
	}
	
	
	/*init ng-tables*/
	$scope.fetchvehiclesWithDumpyards = function(){
		//$scope.showRoute();
		$http.get('/fetchvehiclesWithDumpyards').then(function(response) {
			if(response.data.status == 1) {
				$scope.vehicleWithDumpyard = response.data.data;
				$scope.collectionCentersFlag = response.data.collectionCentersFlag;
				angular.forEach(response.data.data, function(value, key) {
					//console.log(value.collectionCenters, key);
					angular.forEach(value.collectionCenters, function(v, k) {
						$scope.markers.push(v);
					});
					if(value.dumpyards) {
						$scope.dumpyards.push(value.dumpyards);
					}

			    });
			    //console.info($scope.markers);console.log($scope.dumpyards);
			    $scope.dumpyardsFlag = true;
    			$scope.markersFlag = true;

			} else {
				toaster.pop('error', "Oops something went wrong.", "error while getting vehicles, try again in sometime, while we are fixing the problem.");
			}
		});
	}
	

	NgMap.getMap().then(function(map) {
		$scope.map = map;
	});

}])