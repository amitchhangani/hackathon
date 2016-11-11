"use strict"
hackathon.controller("usersController", [ '$scope','$http','$state','$rootScope','NgMap','GeoCoder', 'NgTableParams',function($scope, $http, $state, $rootScope, NgMap, GeoCoder, NgTableParams) {
	//alert('cityController');
	$scope.user = {
		name: '',
		role: 'Driver'
	};
	$scope.vehicleList = {};
	
	/* ADD City */
	$scope.adduser = function(){
		$http.post('/adduser', $scope.user)
		.then(
			function(response) {				
				if(response.data.status == 1){
					console.log("reached here.");
					$scope.getAllUsers();
					$scope.user = {};
					$scope.user.role = 'Driver';
				}else{
					alert('error while adding user.');
				}
			}
		);
	}
	
	
	//var self = this;
	/*init ng-tables*/
	$scope.getAllUsers = function(){
		$http.get('/fetchusers').then(function(response) {
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
				alert('error while adding user.');a
			}
		});
	}

	/**
	 * get vehicles list for dropdown
	 *
	 */
	$scope.getVehicles = function() {
		$http.get('/fetchvehicles').then(function(response) {
			if(response.data.status == 1) {
				$scope.vehicleList = response.data.data;
			} else {
				alert('error while adding vehicle.');a
			}
		});
	}

	$scope.getVehicles();

}])