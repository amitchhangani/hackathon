"use strict"
hackathon.controller("cpStatsController", [ '$scope','$http','$state','$rootScope','NgMap','GeoCoder', 'NgTableParams', 'toaster',function($scope, $http, $state, $rootScope, NgMap, GeoCoder, NgTableParams, toaster) {
	//alert('cityController');
	$scope.stat = {
		vehicleStatus: '0',
	};
	$scope.cpList = [];
	
	/* ADD City */
	$scope.addstat = function(){
		$http.post('/addcpstats', $scope.stat)
		.then(
			function(response) {				
				if(response.data.status == 1){
					toaster.pop('success', "Everything's looking great :)", "stats for today has been submitted successfull, Have a good day.");
					$scope.stat = {};
					$scope.stat.vehicleStatus = '0';
				}else if(response.data.status == 2){
					toaster.pop('error', "Oops something went wrong.", "You have already added collection point report for today.");
				}
				else{
					toaster.pop('error', "Oops something went wrong.", "error while adding stats of vehicle.");
				}
			}
		);
	}
	
	

	/**
	 * get vehicles list for dropdown
	 *
	 */
	$scope.fetchCollectionCenters = function() {
		$http.get('/fetchCollectionCenters').then(function(response) {
			if(response.data.status == 1) {
				$scope.cpList = response.data.data;
			} else {
				toaster.pop('error', "Oops! something went wrong.", "error while fetching vehicles, make sure you have added vehicle information.");
			}
		});
	}
	$scope.fetchCollectionCenters();

}])