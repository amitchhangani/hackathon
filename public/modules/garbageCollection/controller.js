"use strict"
hackathon.controller("gcController", [ '$scope','$http','$state','$rootScope','NgMap','GeoCoder', 'toaster', function($scope, $http, $state, $rootScope, NgMap, GeoCoder, toaster) {
	//alert('cityController');
	$scope.map= {};
	$scope.location = {};
	$scope.showNewMarker = {};
	$scope.showNewMarker.val  = false;
	$scope.vehicles = [];

	/*init gMaps*/
	$scope.initGMap = function(){
		$scope.types = "['establishment']";
	}
	
	$http.get('/fetchvehicles').then(function(res){
		if(res.data.status ==1)
		{
			$scope.vehicles = res.data.data;
		}else{
			toaster.pop('error', "Oops something went wrong.", "seems vehicles are missing from our database.");
		}
	},function(err){
		toaster.pop('error', "Oops something went wrong.", "some network error occured, let's try one more time.");
	});
	
	$scope.placeChanged = function() {
		$scope.place = this.getPlace();
		if ($scope.place.geometry != undefined) {
			$scope.pinlat = $scope.place.geometry.location.lat();
			$scope.pinlng = $scope.place.geometry.location.lng();
			$scope.map.setCenter($scope.place.geometry.location);
		} else {
			GeoCoder.geocode({
				address: $scope.address
			}).then(function(result) {
				$scope.pinlat = result[0].geometry.location.lat();
				$scope.pinlng = result[0].geometry.location.lng();
				$scope.map.setCenter(result[0].geometry.location);
			});
		}

		$scope.showNewMarker.val  = true;
	}
	$scope.dragEnd = function(event) {
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
	
	
	
	$scope.saveGC = function(){
		if($scope.address && $scope.pinlng && $scope.pinlat && $scope.vehicle){
			var postdata = {};
			postdata.lat = $scope.pinlat;
			postdata.long = $scope.pinlng;
			postdata.name = $scope.address;
			postdata.vehicle = JSON.parse($scope.vehicle);
			postdata.city = $rootScope.city._id;
			$http.post('/createCollectionCenter', postdata)
			.then(
				function(response) {
					if(response.data.status == 1){
						$rootScope.city.collectionCenters.push(response.data.data);
						toaster.pop('success', "Everything's looking great :)", "garbage collection points information added to our database.");
						$scope.showNewMarker.val  = false;
						$scope.address = "";
						$scope.vehichle = "";
					}else{
						toaster.pop('error', "Oops something went wrong.", response.data.message);
					}
				},function(err){
					toaster.pop('error', "Oops something went wrong.", 'Error while saving garbage collection point. Please try again.');
				}
			);
		}else{
			toaster.pop('warning', "Oops something went wrong.", "please select a valid address, we have implemented google maps for your ease.");
		}
	}
	
	$scope.showDetail = function(e,gc){
		$scope.currentGC = gc;
		console.log(gc)
		$('#agencyModal').modal('show');		
	}
	
	$scope.delGC = function(){
		if($scope.currentGC._id){
			$http.delete('/deleteCollectionCenter/'+$scope.currentGC._id).then(function (response) {
				if(response.data.status){
					$rootScope.city.collectionCenters = response.data.data;
					console.log('id = ',$rootScope.city);
					$scope.showNewMarker.val  = false;
					$scope.address = "";
					$scope.vehichle = "";
					$rootScope.city = {};
					$http.get('/fetchCity').then(function (response) {
						if(response.data.data){
							$rootScope.city = response.data.data;
							$scope.pinlat = $rootScope.city.lat;
							$scope.pinlng = $rootScope.city.long;
							console.log('id = ',$rootScope.city);
							$('#agencyModal').modal('hide');	
						}else{
							//$state.go('addCity');
						}
					}, function (response) {
						toaster.pop('error', "Oops something went wrong.", "That's unusual would you mind trying again.");
					})
				}else{
					//$state.go('addCity');
				}
			}, function (response) {
				toaster.pop('error', "Oops something went wrong.", "seems the server is bussy to take our request please try again.");
			})
		}
	}
}])