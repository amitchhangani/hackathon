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
	
	$scope.showDetail = function(e,marker){
		$scope.currentDump = marker;
		console.log(marker)
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
	$scope.vehicles =[];
	
	$http.get('/fetchvehicles').then(function(res){
		if(res.data.status ==1)
		{
			$scope.vehicles = res.data.data;
			console.log('$scope.vehicles', $scope.vehicles);
		}else{
			toaster.pop('error', "Oops something went wrong.", "seems vehicles are missing from our database.");
		}
	},function(err){
		toaster.pop('error', "Oops something went wrong.", "some network error occured, let's try one more time.");
	});
	
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
	$scope.showDetail = function(e,marker){
		$scope.currentCP = marker;
		console.log(marker)
		$('#agencyModal').modal('show');		
	}
	
	$scope.addToCP = function(data){
		console.log($scope.currentCP.address , $scope.currentCP.lng , $scope.currentCP.lat , $scope.vehicle)
		if($scope.currentCP.address && $scope.currentCP.lng && $scope.currentCP.lat){
			if(!$scope.vehicle){
				toaster.pop('error', "Missing vehicle info :(", "Please Select a vehicle to proceed.");
				return false;
			}
			var postdata = {};
			postdata.lat = $scope.currentCP.lat;
			postdata.long = $scope.currentCP.lng;
			postdata.name = $scope.currentCP.address;
			postdata.vehicle = JSON.parse($scope.vehicle);
			postdata.city = $rootScope.city._id;
			postdata.reportCase = true;
			postdata.clientId = $scope.currentCP._id;
			$http.post('/createCollectionCenter', postdata)
			.then(
				function(response) {
					if(response.data.status == 1){
						$rootScope.city.collectionCenters.push(response.data.data);
						toaster.pop('success', "Everything's looking great :)", "garbage collection points information added to our database.");
						$('#agencyModal').modal('hide');
						setTimeout(function(){
							$state.go('city');
						},1)
						
						
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
	
}])