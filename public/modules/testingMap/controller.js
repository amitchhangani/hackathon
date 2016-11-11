"use strict";
angular.module("map", ['ngMap'])
shopifyApp.controller("mapCtrl", ['$location', '$scope', '$rootScope', 'mapService', '$uibModal', '$confirm', '$localStorage', 'NgMap', '$timeout', '$stateParams', function($location, $scope, $rootScope, mapService, $uibModal, $confirm, $localStorage, NgMap, $timeout, $stateParams) {
	$scope.search = {};
	$scope.showdirections = false;
	$scope.showMarker = true;
	$scope.settings = {};
	$scope.positions = [];
	$scope.filterValue = [];
	$scope.mapLaodKey = false;
	// $scope.showdirections = true;
	// $scope.directionOrigin = "e-37 , phase-8 , mohali , punjab , India";
	// $scope.destination = 'rohru, himachal pradesh , india';
	var infowindow;


	$scope.filters = function() {

		mapService.getFilters(function(response) {
			if (response.messageId == 200) {
				$scope.filters = response.data
			} else {

			}
		})
	}

	$scope.editFilters = function(value) {



		var index = $scope.filterValue.indexOf(value.filter);
		if (index == -1)
			$scope.filterValue.push(value.filter);
		else
			$scope.filterValue.splice(index, 1)

		console.log($scope.filterValue);


	}

	$scope.findAllstoresLoc = function() {
		console.log("results:", $scope.search.results);
		var inputJson = {};

		console.log("shop_name", $stateParams.shopUrl);
		if ($stateParams.shopUrl) {
			inputJson.shop_name = $stateParams.shopUrl;
		}
		if ($scope.search.postal) {
			inputJson.postal = $scope.search.postal;
		}
		if ($scope.search.distance) {
			inputJson.distance = $scope.search.distance;
			if ($scope.settings.unit == 'KM') {
				inputJson.unit = 'KM'
			}
			if ($scope.settings.unit == 'MI') {
				inputJson.unit = 'MI'
			}
		}
		if ($scope.search.results) {
			inputJson.limit = parseInt($scope.search.results);


		} else {
			inputJson.limit = 300;
		}
		if ($scope.filterValue.length > 0) {
			inputJson.filters = $scope.filterValue;

		}
		if ($scope.search.postal && $scope.search.distance) {
			if ($scope.positions.length > 0) {
				$scope.positions.splice(0, $scope.positions.length);
			}
			var geocoder = new google.maps.Geocoder();
			if (geocoder) {
				geocoder.geocode({
					'address': $scope.search.postal
				}, function(result, status) {
					console.log("result:", result);
					console.log("status:", status);
					if (status == google.maps.GeocoderStatus.OK) {
						inputJson.currentLocation = {
							pos: [result[0].geometry.location.lat(), result[0].geometry.location.lng()]
						}
						console.log("lat and lng:", inputJson.currentLocation);
						console.log("input sent:", inputJson);

						mapService.getLocations(inputJson, function(response) {
							if (response.messageId == 200) {
								$scope.storsLocations = response.data;
								console.log("data recieved:", response.data);
								for (var i = 0; i < response.data.length; i++) {
									$scope.positions.push({
										title: response.data[i].store_name,
										pos: [response.data[i].latitude, response.data[i].longitude],
										id: response.data[i]._id,
										store_name: response.data[i].store_name,
										address: response.data[i].address,
										city: response.data[i].city,
										state: response.data[i].state,
										country: response.data[i].country_name,
										postal: response.data[i].postal,
										email: response.data[i].email,
										start_time: response.data[i].start_time,
										end_time: response.data[i].end_time,
										fax: response.data[i].fax,
										phone: response.data[i].phone,
										website: response.data[i].website,
										working_days: response.data[i].working_days.toString(),
										custom_fields: response.data[i].custom_fields,
										custom_filters: response.data[i].custom_filters


									})
								}



								console.log("positions:", $scope.positions);
							}

						});


					}
				});

			}
		} else {
			$scope.positions.splice(0, $scope.positions.length);
			mapService.getLocations(inputJson, function(response) {
				if (response.messageId == 200) {
					$scope.storsLocations = response.data;
					console.log("data recieved:", response.data);
					for (var i = 0; i < response.data.length; i++) {
						$scope.positions.push({
							title: response.data[i].store_name,
							pos: [response.data[i].latitude, response.data[i].longitude],
							id: response.data[i]._id,
							store_name: response.data[i].store_name,
							address: response.data[i].address,
							city: response.data[i].city,
							state: response.data[i].state,
							country: response.data[i].country_name,
							postal: response.data[i].postal,
							email: response.data[i].email,
							start_time: response.data[i].start_time,
							end_time: response.data[i].end_time,
							fax: response.data[i].fax,
							phone: response.data[i].phone,
							website: response.data[i].website,
							working_days: response.data[i].working_days.toString(),
							custom_fields: response.data[i].custom_fields,
							custom_filters: response.data[i].custom_filters,
							group_color: response.data[i].group_name.color


						})
					}



					console.log("positions:", $scope.positions);
				}

			});
		}


	}



	var map;
	$scope.$on('mapInitialized', function(event, evtMap) {
		map = evtMap;
		$scope.displaySettings();
		// map.setZoom($scope.settings.map_zoom);
		infowindow = new google.maps.InfoWindow();

	});

	$scope.showDetail = function(e, shop) {
		console.log("shop data:", shop)
		$scope.shopData = shop
		map.showInfoWindow('foo-iw', shop.id);
	};
	$scope.showDetail2 = function(shop) {
		console.log("shop data:", shop)
		$scope.shopData = shop
		map.showInfoWindow('foo-iw', shop.id);
	};

	$scope.displaySettings = function() {
		var input = {
			shop_id: $stateParams.shopUrl
		};
		mapService.getDisplaySetting(input, function(response) {
			if (response.messageId == 200) {
				$scope.settings = response.data;
				map.setZoom($scope.settings.map_zoom);
			}

		})
	}

	$scope.shoDirections = function(value) {
		//infowindow = new google.maps.InfoWindow();
		console.log("direction value:", value);
		if ($scope.search.postal) {
			$scope.showdirections = true;
			$scope.showMarker = false;
			var geocoder = new google.maps.Geocoder();
			if (geocoder) {
				geocoder.geocode({
					'address': $scope.search.postal
				}, function(result, status) {
					console.log("result:", result);
					console.log("status:", status);
					if (status == google.maps.GeocoderStatus.OK) {
						$scope.positions = {
							title: 'Marker 1',
							pos: [result[0].geometry.location.lat(), result[0].geometry.location.lng()]
						}

						console.log("position in change function:", $scope.position);
						$scope.directionOrigin = [result[0].geometry.location.lat(), result[0].geometry.location.lng()]

						setTimeout(function() {
							$scope.$apply()
						}, 1)
					}
				});

			}

			$scope.destination = value.address + " , " + value.city + " , " + value.state + " , " + value.country;

		} else {
			alert("please enter location");
		}
	}
	$scope.mapKey = function() {
		if ($stateParams.shopUrl) {
			var input = {
				shop_name: $stateParams.shopUrl
			}
			mapService.getMapKey(input, function(response) {
				if (response.messageId == 200) {
					$scope.mapLaodKey = response.data.api_key;
				} else {
					console.log("key is not available")
				}
			})
		}
	}
	$scope.empty = function() {
		window.location.reload()

	}

}]);