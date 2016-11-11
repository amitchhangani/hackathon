"use strict"
hackathon.controller("cityController", [ '$scope','$http','$state','$rootScope','NgMap','GeoCoder',function($scope,$http,$state,$rootScope,NgMap,GeoCoder) {
	//alert('cityController');
	$scope.map= {};
	$scope.location = {};
	
	/* ADD City */
	$scope.addCity = function(){
		console.log($scope.map,$scope.details);
		var postdata = {};
		postdata.lat = $scope.details.lat;
		postdata.long = $scope.details.lng;
		postdata.name = $scope.details.name;
		$http.post('/createCity', postdata)
		.then(
			function(response) {				
				if(response.data.status == 1){
					$rootScope.city = response.data.data;
					console.log('id = ',$rootScope.city);
					$state.go('city');
					
				}else{
					alert('error while adding city');
				}
			}
		);
	}
	
	
	
	/*init gMaps*/
	$scope.initGMap = function(){
		$scope.types = "['establishment']";
		$scope.pinlat = $rootScope.city.lat;
		$scope.pinlng = $rootScope.city.long;
	}
	
	$scope.placeChanged = function() {
		console.log('place changed called')
		$scope.place = this.getPlace();
		console.log('location', $scope.place);
		if ($scope.place.geometry != undefined) {
			$scope.pinlat = $scope.place.geometry.location.lat();
			$scope.pinlng = $scope.place.geometry.location.lng();
			$scope.map.setCenter($scope.place.geometry.location);
		} else {
			GeoCoder.geocode({
				address: $scope.address
			}).then(function(result) {
				//console.log(result[0].geometry.location.lat());
				$scope.pinlat = result[0].geometry.location.lat();
				$scope.pinlng = result[0].geometry.location.lng();
				$scope.map.setCenter(result[0].geometry.location);
			});
		}
	}
	$scope.dragEnd = function(event) {
		console.log('dragend called');
		GeoCoder.geocode({
			latLng: event.latLng
		}).then(function(result) {
			$scope.address = result[0].formatted_address;
		});
	}
	NgMap.getMap().then(function(map) {
		$scope.map = map;
	});	
}])