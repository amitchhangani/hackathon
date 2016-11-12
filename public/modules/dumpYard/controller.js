"use strict"
hackathon.controller("dumpController", [ '$scope','$http','$state','$rootScope','NgMap','GeoCoder', 'toaster', function($scope, $http, $state, $rootScope, NgMap, GeoCoder, toaster) {
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
		//console.log('place changed called')
		$scope.place = this.getPlace();
		//console.log('location', $scope.place);
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
			//console.log($scope.address,$scope.pinlat,$scope.pinlng);
			var postdata = {};
			postdata.lat = $scope.pinlat;
			postdata.long = $scope.pinlng;
			postdata.name = $scope.address;
			postdata.city = $rootScope.city._id;
			$http.post('/createDumpYard', postdata)
			.then(
				function(response) {				
					if(response.data.status == 1){
						$rootScope.city.dumpYards = response.data.data;
						toaster.pop('success', "Everything's looking great :)", "dumping yard information added to our database.");
						$scope.showNewMarker.val  = false;
						$scope.address = "";
					}else{
						toaster.pop('error', "Oops something went wrong.", response.data.message);
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
		if($scope.currentDump._id){
			$http.delete('/deleteDumpYard/'+$scope.currentDump._id).then(function (response) {
				if(response.data.status){
					$rootScope.city.dumpYards = response.data.data;
					//console.log('id = ',$rootScope.city);
					$scope.showNewMarker.val  = false;
					$scope.address = "";
					$rootScope.city = {};
					$http.get('/fetchCity').then(function (response) {
						if(response.data.data){
							$rootScope.city = response.data.data;
							$scope.pinlat = $rootScope.city.lat;
							$scope.pinlng = $rootScope.city.long;
							//console.log('id = ',$rootScope.city);
							$('#agencyModal').modal('hide');	
						}else{
							//$state.go('addCity');
						}
					}, function (response) {
						toaster.pop('error', "Oops something went wrong.", "we are facing some technical problem please try again later.");
					})
				}else{
					//$state.go('addCity');
				}
			}, function (response) {
				toaster.pop('error', "Oops something went wrong.", "we are facing some technical problem please try again later.");
			})
		}
	}
}])