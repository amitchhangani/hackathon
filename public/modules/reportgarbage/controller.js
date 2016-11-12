"use strict"
hackathon.controller("reportgarbagesController", [ '$scope','$http','$state','$rootScope','NgMap','GeoCoder', 'toaster', function($scope, $http, $state, $rootScope, NgMap, GeoCoder, toaster) {
	//alert('cityController');
	$scope.map= {};
	$scope.location = {};
	$scope.showNewMarker = {};
	$scope.showNewMarker.val  = false;
	
	
	/*init gMaps*/
	$scope.initGMap = function(){
		$scope.types = "['establishment']";
		
	}
	
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
	
	
	/**
	 * Garbage reporting by anonymous user
	 * 
	 */
	$scope.reportGarbage = function(){
		if($scope.address && $scope.pinlng && $scope.pinlat){
			console.log($scope.address, $scope.pinlat,$scope.pinlng);
			var postdata = {};
			postdata.lat = $scope.pinlat;
			postdata.lng = $scope.pinlng;
			postdata.address = $scope.address;
			postdata.city = $rootScope.city._id;
			$http.post('/reportgarbage', postdata)
			.then(
				function(response) {				
					if(response.data.status == 1){
						//$rootScope.city = response.data.data;
						//console.log('id = ',$rootScope.city);
						//$state.go('city');
						//$rootScope.city.dumpYards = response.data.data;
						toaster.pop('success', "Everything's looking great :)", "Thank you for taking out time and reporting for garbage, our vehicles are around the corner we will get the garbage in short while.");
						$scope.showNewMarker.val  = false;
						$scope.address = "";
					}else{
						toaster.pop('error', response.data.message, "we are a bit occupied right now please try again in sometime.");
					}
				}
			);
		}else{
			toaster.pop('warning', "Oops something went wrong.", "please select a valid address, we have implemented google maps for your ease.");
		}
	}
	
	$scope.showDetail = function(e,dump){
		$scope.currentDump = dump;
		console.log(dump)
		$('#agencyModal').modal('show');		
	}
	
	$scope.delDump = function(){
		/*if($scope.currentDump._id){
			$http.delete('/deleteDumpYard/'+$scope.currentDump._id).then(function (response) {
				if(response.data.status){
					$rootScope.city.dumpYards = response.data.data;
					console.log('id = ',$rootScope.city);
					$scope.showNewMarker.val  = false;
					$scope.address = "";
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
						alert('error while getting api data');
					})
				}else{
					//$state.go('addCity');
				}
			}, function (response) {
				alert('Something went wrong please try again later.');
			})
		}*/
	}
}])
.controller("reportgarbageListsController", [ '$scope','$http','$state','$rootScope','NgMap','GeoCoder', 'toaster', function($scope, $http, $state, $rootScope, NgMap, GeoCoder, toaster) {
	//alert('cityController');
	$scope.map= {};
	$scope.locations = {};
	$scope.showNewMarker = {};
	$scope.showNewMarker.val  = false;
	
	
	/*init gMaps*/
	$scope.initGMap = function(){
		$scope.types = "['establishment']";
		$http.get('reportedgarbagelist').then(function(response) {
			if(response.data.status == 1){
				//console.info(response.data.data);
				$scope.locations = response.data.data;
			} else {
				toaster.pop('error', response.data.message, "we are a bit occupied right now please try again in sometime.");
			}
		});
	}
	
	
	NgMap.getMap().then(function(map) {
		$scope.map = map;
	});
	
	
}])