"use strict";
angular.module("main")
shopifyApp.controller("mainCtrl", ['$location', '$scope', 'mainService', '$uibModal', '$confirm','$localStorage','$window','$http', function($location, $scope, mainService, $uibModal, $confirm,$localStorage,$window,$http) {
	$http.get('/sessionGet').then(function(response) {
		console.log("response:", response);
		if (response.data.messageId == 200) {
			$scope.sessionData = response.data.data;
		}else{

		}
	})


	$scope.logout = function() {
		$confirm({
			text: 'Are you sure you want to logout?'
		})
		.then(function() {
			mainService.logout(function(response) {
				if (response.messageId == 200) {
					delete $localStorage.payment;
					delete $localStorage.id;
					delete $localStorage.shopName;
					$location.path('/home');
				} else {
					alert("Request can't process now!");
				}
			})
		});
	}
	$scope.bulkExport = function(){
		$http.get('/sessionGet').then(function(response) {
			console.log("response:", response);
			if (response.data.messageId == 200) {
				if (response.data.data.payment_recieved) {
					if ($localStorage.id) {
						$confirm({
							text: 'Are you sure you want to download a CSV file of your stores?'
						}).then(function(){
							mainService.bulkExport({id:$localStorage.id},function(response) {
								console.log(response);
								if (response.messageId == 200) {
									$scope.csvLink = response.data;
									var port = $location.port();
									var host = $location.host();
									var protocol = $location.protocol();
									var s = protocol+"://"+host+":"+port+"/storesCsv/"+$scope.csvLink;
									$window.open(s);
								}else{
									alert('eeeerrrror');
								}
							})
						})
					}else{
						//$scope.logout()	
					}
				}else{
					$location.path('/paymentScreen/'+response.data.data._id);	
				}
				
			}else{
				$location.path('/');
			}
		});
	}
}]);