"use strict"
hackathon.controller("usersController", [ '$scope','$http','$state','$rootScope','NgMap','GeoCoder', 'NgTableParams', 'toaster',function($scope, $http, $state, $rootScope, NgMap, GeoCoder, NgTableParams, toaster) {
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
					toaster.pop('success', "Everything's looking great :)", "user information added to our database.");
					$scope.getAllUsers();
					$scope.user = {};
					$scope.user.role = 'Driver';
				}else{
					toaster.pop('error', "Oops something went wrong.", "error while adding user.");
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
				toaster.pop('error', "Oops! something went wrong.", "error while fetching user.");
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
				alert('error while adding vehicle.');
				toaster.pop('error', "Oops! something went wrong.", "error while fetching vehicles, make sure you have added vehicle information.");
			}
		});
	}

	$scope.getVehicles();

}])