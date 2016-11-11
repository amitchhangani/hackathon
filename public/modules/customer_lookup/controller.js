"use strict";
angular.module("lookup", ['ngMap'])
shopifyApp.controller("lookupCtrl", ['$location', '$scope', '$rootScope', 'lookupService', '$uibModal', '$confirm', '$localStorage', 'NgMap', function($location, $scope, $rootScope, lookupService, $uibModal, $confirm, $localStorage, NgMap) {

	
	$scope.cities = {};
	
	var geocoder;

	var map;
	$scope.$on('mapInitialized', function(event, evtMap) {
		map = evtMap;
		geocoder = new google.maps.Geocoder();
		$scope.getCircles();


	});
	$scope.getRadius = function(num) {
		return Math.sqrt(num) * 10;
	}
	$scope.getCircles = function() {
		console.log("id:", $localStorage.id);
		var input = {
			shop_id: $localStorage.id
		}
		lookupService.fetchCircles(input, function(response) {
			if (response.messageId == 200) {
				$scope.cities = response.data
				console.log("data receieved", response.data);


			}
		})
	}



}]);