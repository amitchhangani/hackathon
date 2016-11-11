angular.module("filters")
shopifyApp.controller("filterCtrl", ['$scope', 'DetailService', '$uibModal', '$confirm', '$localStorage', 'NgTableParams','$timeout', function($scope, DetailService, $uibModal, $confirm, $localStorage, NgTableParams,$timeout) {
	$scope.get = function() {
		if ($localStorage.id) {
			var input = {};
			input.id = $localStorage.id;
			DetailService.getFilter(input, function(response) {
				if (response.messageId == 200) {
					if (response.data < 0) {
						$scope.shomessageFilters = true;
						$scope.alerttypeFilters = "alert alert-warning";
						$scope.messageFilters = "Oops,sorry no data found."
					} else {
						$scope.shomessageFilters = true;
						$scope.alerttypeFilters = "alert alert-success";
						$scope.messageFilters = "You currently have " + response.data.length + " Filters.";
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
						$scope.filters = response.data;
					}
				} else {
					$scope.shomessageFilters = true;
					$scope.alerttypeFilters = "alert alert-danger";
					$scope.messageFilters = "Error in getting filters data.";

				}


			});
		}
	}
	$scope.deletefilter = function(id) {
		$confirm({
				text: 'Are you sure you want to delete filter?'
			})
			.then(function() {
				DetailService.deleteFilter({
					'id': id
				}, function(response) {
					if (response.messageId == 200) {
						$scope.shomessageFilters = true;
						$scope.alerttypeFilters = "alert alert-success";
						$scope.messageFilters = "Filter deleted successfullt.";
						$timeout(function(argument) {
							$scope.shomessageFilters = false;
							$scope.get();
						}, 2000)
					} else {
						$scope.shomessageFilters = true;
						$scope.alerttypeFilters = "alert alert-danger";
						$scope.messageFilters = "Error in deleting filter.";
						$timeout(function(argument) {
							$scope.shomessageFilters = false;

						}, 2000)
					}

				})
			});

	}
	$scope.addfilter = function() {
		if ($localStorage) {
			$scope.store.shop_id = $localStorage.id;
			DetailService.addFilter($scope.store, function(response) {
				if (response.messageId == 200) {
					console.log(response);


					$scope.showmessagefilter = true;
					$scope.alerttypefilter = "alert alert-success"
					$scope.messagefilter = response.message;
					$timeout(function(argument) {
						$scope.showmessagefilter = false;
						$scope.store = {};
						  $('#myModal').modal('hide');
						$scope.messagefilter = "";
						$scope.get();
						
					}, 2000)
				} else {
					$scope.showmessagefilter = true;
					$scope.alerttypefilter = "alert alert-danger"
					$scope.messagefilter = response.message;
					$timeout(function(argument) {
						$scope.showmessagefilter = false;

						$scope.messagefilter = "";
						$scope.store.filter = "";
					}, 2000)
				}
			})
		}
	};
}]);