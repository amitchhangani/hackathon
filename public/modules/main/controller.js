"use strict"
hackathon.controller("mainController", [ '$scope','$http','$state','$rootScope',function($scope,$http,$state,$rootScope) {
	//alert('cityController');
	$scope.getCityData = function(){
		console.log('get city data');
		$http.get('/fetchCity').then(function (response) {
			if(response.data.data){
				$rootScope.city = response.data.data;
				$scope.pinlat = $rootScope.city.lat;
				$scope.pinlng = $rootScope.city.long;
				console.log('id = ',$rootScope.city);
			}else{
				//$state.go('addCity');
			}
		}, function (response) {
			alert('error while getting api data');
		})
	}
	$scope.getCityData();
	
}])