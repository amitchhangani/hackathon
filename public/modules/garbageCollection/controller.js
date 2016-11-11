"use strict"
hackathon.controller("gcController", [ '$scope','$http','$state','$rootScope','NgMap','GeoCoder',function($scope,$http,$state,$rootScope,NgMap,GeoCoder) {
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
	
	console.log('outside')
	$http.get('/fetchvehicles').then(function(res){
		if(res.data.status ==1)
		{
			
			$scope.vehicles = res.data.data;
			//console.log('@@@@@@@@@@@',res);
		}else{
			alert('error while fetching vehicle data')
		}
	},function(err){
		//console.log('errrr',err);	
	});
	
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
		//console.log('dragend called');
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
			//console.log($scope.address,$scope.pinlat,$scope.pinlng);
			var postdata = {};
			postdata.lat = $scope.pinlat;
			postdata.long = $scope.pinlng;
			postdata.name = $scope.address;
			//console.log($scope.vehicle);
			postdata.vehicle = JSON.parse($scope.vehicle);
			postdata.city = $rootScope.city._id;
			//alert('w');
			$http.post('/createCollectionCenter', postdata)
			.then(
				function(response) {
					if(response.data.status == 1){
						$rootScope.city.collectionCenters.push(response.data.data);
						alert('success');
						$scope.showNewMarker.val  = false;
						$scope.address = "";
						$scope.vehichle = "";
					}else{
						alert('error while adding city');
					}
				},function(err){
					alert('Error while saving garbage collection point. Please try again. ')
				}
			);
		}else{
			alert('Please select a valid address');
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
					$rootScope.city.dumpYards = response.data.data;
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
						alert('error while getting api data');
					})
				}else{
					//$state.go('addCity');
				}
			}, function (response) {
				alert('Something went wrong please try again later.');
			})
		}
	}
}])