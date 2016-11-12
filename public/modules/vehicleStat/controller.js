"use strict"
hackathon.controller("vehicleStatsController", [ '$scope','$http','$state','$rootScope','NgMap','GeoCoder', 'NgTableParams', 'toaster',function($scope, $http, $state, $rootScope, NgMap, GeoCoder, NgTableParams, toaster) {
	//alert('cityController');
	$scope.stat = {
		vehicleStatus: '0',
	};
	$scope.vehicleList = {};
	
	/* ADD City */
	$scope.addstat = function(){
		$http.post('/addvehiclestats', $scope.stat)
		.then(
			function(response) {				
				if(response.data.status == 1){
					toaster.pop('success', "Everything's looking great :)", "stats for today has been submitted successfull, Have a good day.");
					$scope.stat = {};
					$scope.stat.vehicleStatus = '0';
				}else{
					toaster.pop('error', "Oops something went wrong.", "error while adding stats of vehicle.");
				}
			}
		);
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
				toaster.pop('error', "Oops! something went wrong.", "error while fetching vehicles, make sure you have added vehicle information.");
			}
		});
	}


}])