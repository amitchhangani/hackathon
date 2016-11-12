"use strict"
hackathon.controller("vehiclesController", [ '$scope','$http','$state','$rootScope','NgMap','GeoCoder', 'NgTableParams', 'toaster',function($scope, $http, $state, $rootScope, NgMap, GeoCoder, NgTableParams, toaster) {
	//alert('cityController');
	$scope.vehicle = {};
	$scope.location = {};
	$scope.vehicle.type = 'Big Truck';
	
	/*
     * Add vehicle information in database.
     * 
	 */
	$scope.addvehicle = function(){
		$scope.vehicle.city = $rootScope.city._id;
		$http.post('/addvehicle', $scope.vehicle)
		.then(
			function(response) {				
				if(response.data.status == 1){
					toaster.pop('success', "Everything's looking great :)", "vehicle information added to our database.");
					$scope.getAllVehicles();
					$scope.vehicle = {};
					$scope.vehicle.type = 'Big Truck';
				}else{
					toaster.pop('error', "Oops something went wrong.", "error while adding vehicle.");
				}
			}
		);
	}
	
	
	/*init ng-tables*/
	$scope.getAllVehicles = function(){
		$http.get('/fetchvehicles').then(function(response) {
			if(response.data.status == 1) {
				$scope.tableParams = new NgTableParams({
		            page: 1,
		            count: 10,
		            sorting: {
		                name: "asc"
		            }
		        }, {
		            total: response.data.data.length,
		            counts: [],
		            data: response.data.data
		        });
			} else {
				toaster.pop('error', "Oops something went wrong.", "error while getting vehicles, try again in sometime, while we are fixing the problem.");
			}
		});
	}
	

}])