"use strict"
hackathon.controller("vehiclesController", [ '$scope','$http','$state','$rootScope','NgMap','GeoCoder', 'NgTableParams',function($scope, $http, $state, $rootScope, NgMap, GeoCoder, NgTableParams) {
	//alert('cityController');
	$scope.vehicle = {};
	$scope.location = {};
	$scope.vehicle.type = 'Big Truck';
	
	/* ADD City */
	$scope.addvehicle = function(){
		$http.post('/addvehicle', $scope.vehicle)
		.then(
			function(response) {				
				if(response.data.status == 1){
					console.log("reached here.");
					$scope.getAllVehicles();
					$scope.vehicle = {};
					$scope.vehicle.type = 'Big Truck';
				}else{
					alert('error while adding vehicle.');
				}
			}
		);
	}
	
	
	//var self = this;
	var vehicledata = [{name: "Moroni", age: 50} , {name: "Another", age: 23}];	
	/*init ng-tables*/
	$scope.getAllVehicles = function(){
		$http.get('fetchvehicles').then(function(response) {
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
				alert('error while adding vehicle.');a
			}
		});
	}
	

}])