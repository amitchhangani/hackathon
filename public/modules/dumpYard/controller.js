"use strict"
hackathon.controller("dumpController", [ '$scope','$http','$state','$rootScope','NgMap','GeoCoder',function($scope,$http,$state,$rootScope,NgMap,GeoCoder) {
	//alert('cityController');
	$scope.map= {};
	$scope.location = {};
	$scope.showNewMarker = {};
	$scope.showNewMarker.val  = false;

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

		$scope.showNewMarker.val  = true;
	}
	$scope.dragEnd = function(event) {
		console.log('dragend called');
		GeoCoder.geocode({
			latLng: event.latLng
		}).then(function(result) {
			$scope.pinlat = result[0].geometry.location.lat();
			$scope.pinlng = result[0].geometry.location.lng();
			$scope.address = result[0].formatted_address;
		});

		$scope.showNewMarker.val  = true;
	}
	
	NgMap.getMap().then(function(map) {
		$scope.map = map;
	});
	
	
	
	$scope.saveDumpYard = function(){
		if($scope.address && $scope.pinlng && $scope.pinlat){
			console.log($scope.address,$scope.pinlat,$scope.pinlng);
			var postdata = {};
			postdata.lat = $scope.pinlat;
			postdata.long = $scope.pinlng;
			postdata.name = $scope.address;
			postdata.city = $rootScope.city._id;
			$http.post('/createDumpYard', postdata)
			.then(
				function(response) {				
					if(response.data.status == 1){
						//$rootScope.city = response.data.data;
						//console.log('id = ',$rootScope.city);
						//$state.go('city');
						$scope.dumpYards = response.data.data;
						alert('success');

						$scope.showNewMarker.val  = false;
						$scope.address = "";
					}else{
						alert('error while adding city');
					}
				}
			);
		}else{
			alert('Please select a valid address');
		}
	}
	
	$scope.showDetail = function(dump){
		$scope.currentDump = dump;
		alert('here222')
		
	}
	
	$scope.delDump = function(){
		alert('here')
	}
}])