"use strict";
angular.module("fields")
shopifyApp.controller("fieldCtrl", ['$scope', 'DetailService', '$uibModal', '$confirm', '$localStorage', 'NgTableParams','$timeout', function($scope, DetailService, $uibModal, $confirm, $localStorage, NgTableParams,$timeout) {
	$scope.getfield = function() {
		if ($localStorage.id) {
			var input = {};
			input.id = $localStorage.id;
			DetailService.getField(input, function(response) {
				if (response.messageId == 200) {
					if (response.data < 0) {
						$scope.shomessageFields = true;
						$scope.alerttypeFields = "alert alert-warning";
						$scope.messageFields = "Oops,sorry no data found."
					} else {
						$scope.shomessageFields = true;
						$scope.alerttypeFields = "alert alert-success";
						$scope.messageFields = "You currently have " + response.data.length + " fields.";
						$scope.tableParams = new NgTableParams({
							page: 1,
							count: 10,
							sorting: {
								name: "asc"
							}
						}, {
							total: response.data.length,
							counts: [],
							data: response.data
						});
						$scope.simpleList = response.data;
						$scope.fields = response.data;
					}
				} else {
					$scope.shomessageFields = true;
					$scope.alerttypeFields = "alert alert-warning"
					$scope.messageFields = "Error in getting fields data.";
					$timeout(function(argument) {
						$scope.shomessageFields = false;
					}, 2000)
				}


			});
		}
	}

	$scope.deletefield = function(id) {
		$confirm({
				text: 'Are you sure you want to delete field?'
			})
			.then(function() {
				DetailService.deleteField({
					'id': id
				}, function(response) {
					if (response.messageId == 200) {
						$scope.shomessageFields = true;
						$scope.alerttypeFields = "alert alert-success";
						$scope.messageFields = "Filter deleted successfullt.";
						$timeout(function(argument) {
							$scope.shomessageFields = false;
							$scope.getfield();
						}, 2000)
					} else {
						$scope.shomessageFields = true;
						$scope.alerttypeFields = "alert alert-danger";
						$scope.messageFields = "Error in deleting field.";
						$timeout(function(argument) {
							$scope.shomessageFields = false;

						}, 2000)
					}
				})



			})

	}
	$scope.addfield = function() {
		console.log("Logged In:", $localStorage)
		if ($localStorage) {
			$scope.store.shop_id = $localStorage.id;
			console.log("the shop_id se t is", $scope.store.shop_id);
			DetailService.addField($scope.store, function(response) {
				if (response.messageId == 200) {
					console.log("The response is ", response);
					$scope.showmessagefield = true;
					$scope.alerttypefield = "alert alert-success"
					$scope.messagefield = response.message;
					$timeout(function(argument) {
						$scope.showmessagefield = false;
						$scope.messagefield = "";
						$('#myModal').modal('hide');
						$scope.getfield();
						$scope.store.field = "";
					}, 2000)
				} else {
					$scope.showmessagefield = true;
					$scope.alerttypefield = "alert alert-danger"
					$scope.messagefield = response.message
					$timeout(function(argument) {
						$scope.showmessagefield = false;
						$scope.messagefield = "";
						$scope.store.field = "";
					}, 2000)
				}
			})
		}
	};
}]);