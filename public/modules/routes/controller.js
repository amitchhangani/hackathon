"use strict"
hackathon.controller("routesController", [ '$scope','$http','$state','$rootScope','NgMap','GeoCoder', 'NgTableParams', 'toaster',function($scope, $http, $state, $rootScope, NgMap, GeoCoder, NgTableParams, toaster) {
	//alert('cityController');
	$scope.vehicleList = {};
	$scope.location = {};
	$scope.vehicle = {};
	
	/*
     * show routes using google map api provided the user vehicle.
     * 
	 */
	$scope.showRoute = function(){
		//
	}
	
	
	/*init ng-tables*/
	$scope.getAllVehicles = function(){
		$http.get('/fetchvehicles').then(function(response) {
			if(response.data.status == 1) {
				$scope.vehicleList = response.data.data;
			} else {
				toaster.pop('error', "Oops something went wrong.", "error while getting vehicles, try again in sometime, while we are fixing the problem.");
			}
		});
	}
	

}])