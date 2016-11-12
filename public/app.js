"use strict";
//angular.module('city', []);

var hackathon = angular.module('hackathon', ['ui.router','ngMap', 'ngTable', 'toaster', 'ngAnimate'])
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		var checkCity = function($q, $http, $state){
			console.log('*************************');
			var deferred = $q.defer();
			$http.get('/fetchCity').then(function (res) {
				console.log(res)
				if(res.data.data){
					setTimeout(function () {
						if($state.current.name == 'addCity'){
							$state.go('city')
						}
						deferred.resolve()
					}, 0);	
				}else{
					
					setTimeout(function () {
						$state.go('addCity')
						deferred.reject()
					}, 0);	
				}
				
				return deferred.promise;
			}, function (response) {
				setTimeout(function () {
					deferred.reject()
				}, 0);
			})
		}
        $urlRouterProvider.otherwise("/");
		$stateProvider
			
			.state('addCity', {
				url: "/addCity",
				views: {
					"": {
						templateUrl: '/modules/city/views/addCity.html',
						controller: "cityController",
						resolve: {
							checkCity: checkCity
						}
					},
					"header": {
						templateUrl: '/modules/header/views/header.html'
					},
					"sidebar": {
						templateUrl: '/modules/sidebar/views/sidebar.html',
					}
				}
			})
			.state('city', {
				url: "/",
				views: {
					"": {
						templateUrl: '/modules/city/views/city.html',
						controller: "cityController",
						resolve: {
							checkCity: checkCity
						}
					},
					"header": {
						templateUrl: '/modules/header/views/header.html'
					},
					"sidebar": {
						templateUrl: '/modules/sidebar/views/sidebar.html',
					}
				}
			})
			.state('addDump', {
				url: "/addDump",
				views: {
					"": {
						templateUrl: '/modules/dumpYard/views/dumpYard.html',
						controller: "dumpController",
						resolve: {
							checkCity: checkCity
						}
					},
					"header": {
						templateUrl: '/modules/header/views/header.html'
					},
					"sidebar": {
						templateUrl: '/modules/sidebar/views/sidebar.html',
					}
				}
			})
			.state('addGC', {
				url: "/addGC",
				views: {
					"": {
						templateUrl: '/modules/garbageCollection/views/garbageCollection.html',
						controller: "gcController",
						resolve: {
							checkCity: checkCity
						}
					},
					"header": {
						templateUrl: '/modules/header/views/header.html'
					},
					"sidebar": {
						templateUrl: '/modules/sidebar/views/sidebar.html',
					}
				}
			})
			.state('addvehicle', {
				url: "/addvehicle",
				views: {
					"": {
						templateUrl: '/modules/vehicle/views/addvehicle.html',
						controller: "vehiclesController",
						resolve: {
							checkCity: checkCity
						}
					},
					"header": {
						templateUrl: '/modules/header/views/header.html'
					},
					"sidebar": {
						templateUrl: '/modules/sidebar/views/sidebar.html',
					}
				}
			})
			.state('users', {
				url: "/users",
				views: {
					"": {
						templateUrl: '/modules/user/views/users.html',
						controller: "usersController",
						resolve: {
							checkCity: checkCity
						}
					},
					"header": {
						templateUrl: '/modules/header/views/header.html'
					},
					"sidebar": {
						templateUrl: '/modules/sidebar/views/sidebar.html',
					}
				}
			})
			.state('vehiclestat', {
				url: "/vehiclestat",
				views: {
					"": {
						templateUrl: '/modules/vehicleStat/views/vehiclestats.html',
						controller: "vehicleStatsController",
						resolve: {
							checkCity: checkCity
						}
					},
					"header": {
						templateUrl: '/modules/header/views/header.html'
					},
					"sidebar": {
						templateUrl: '/modules/sidebar/views/sidebar.html',
					}
				}
			})
			.state('reportgarbage', {
				url: "/reportgarbage",
				views: {
					"": {
						templateUrl: '/modules/reportgarbage/views/report.html',
						controller: "reportgarbagesController",
						resolve: {
							checkCity: checkCity
						}
					},
					"header": {
						templateUrl: '/modules/header/views/header.html'
					},
					"sidebar": {
						templateUrl: '/modules/sidebar/views/sidebar.html',
					}
				}
			})
			.state('listreportedgarbage', {
				url: "/listreportedgarbage",
				views: {
					"": {
						templateUrl: '/modules/reportgarbage/views/map.html',
						controller: "reportgarbageListsController",
						resolve: {
							checkCity: checkCity
						}
					},
					"header": {
						templateUrl: '/modules/header/views/header.html'
					},
					"sidebar": {
						templateUrl: '/modules/sidebar/views/sidebar.html',
					}
				}
			});

	}]);
