"use strict";
angular.module("home", []);
angular.module('communicationModule', []);
angular.module("main", ['ui.bootstrap', 'angular-confirm']);
angular.module("home", []);
angular.module('communicationModule', []);
angular.module("payment", []);
angular.module("dashboard", []);
angular.module("Details", []);
angular.module("uninstall", []);
angular.module("instructions", []);
angular.module("map", []);
angular.module("groups", []);
angular.module("mapkey", []);
angular.module("dispSetting", []);
angular.module("fileupload", []);
angular.module("lookup", []);
angular.module("fields",[]);
angular.module("filters",[]);

var shopifyApp = angular.module('shopifyApp', ['ui.router', 'ngStorage', 'ngMap', 'main', 'home', 'communicationModule', 'payment', 'dashboard', 'Details', 'mapkey', 'dispSetting', 'uninstall', 'instructions', 'map', 'groups', 'fileupload', 'ngSanitize', 'lookup','ngTable','fields','filters'])
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		var getDetailsToDashboard = function($q, $http, $location, $localStorage) {
			var deferred = $q.defer();
			$http.get('/sessionGet').then(function(response) {
				console.log("response:", response);
				if (response.data.messageId == 200) {
					if (!response.data.data.payment_recieved) {
						console.log("in second if");

						$localStorage.id = response.data.data._id
						$localStorage.shopName = response.data.data.shop;
						var path = '/paymentScreen/:' + response.data.data._id;
						setTimeout(function() {
							deferred.reject();
						}, 0);
						$location.path(path);
					} else {

						$localStorage.id = response.data.data._id;
						$localStorage.shopName = response.data.data.shop;
						var path = "/dashboard";
						setTimeout(function() {
							deferred.resolve();
						}, 0);
						$location.path(path);
					}


				} else {
					setTimeout(function() {
						deferred.reject();
					}, 0);
					$location.path('/');
				}
				return deferred.promise;
			})
		}


		var getDetails = function($q, $http, $location, $localStorage) {
			var deferred = $q.defer();
			$http.get('/sessionGet').then(function(response) {
				console.log("response:", response);
				if (response.data.messageId == 200) {
					if (!response.data.data.payment_recieved) {
						console.log("in second if");

						$localStorage.shopName = response.data.data.shop;
						$localStorage.id = response.data.data._id
						var path = '/paymentScreen/:' + response.data.data._id;
						setTimeout(function() {
							deferred.reject();
						}, 0);
						$location.path(path);
					} else {

						$localStorage.id = response.data.data._id;
						$localStorage.shopName = response.data.data.shop;
						console.log('resolving current path');
						setTimeout(function() {
							deferred.resolve();
						}, 0);
					}


				} else {
					setTimeout(function() {
						deferred.reject();
					}, 0);
					$location.path('/');
				}
				return deferred.promise;
			})
		}
		$urlRouterProvider.otherwise("/");
		$stateProvider
			.state('home', {
				url: "/",
				views: {
					"": {
						templateUrl: "/modules/home/views/home.html",
						controller: "homeController",
						resolve: {
							checked: getDetailsToDashboard
						}
					},
					"header": {}
				}
			}).state('paymentScreen', {
				url: "/paymentScreen/:id",
				views: {
					"": {
						templateUrl: "/modules/payment/views/paymentScreen.html",
						controller: "paymentCtrl"
							// resolve:{checked:getDetailsToDashboard}
					},
					"header": {}
				}
			})
			.state('home2', {
				url: "/home",
				views: {
					"": {
						templateUrl: "/modules/home/views/home.html",
						controller: "homeController",
						resolve: {
							checked: getDetailsToDashboard
						}
					},
					"header": {}
				}
			})
			.state('dashboard', {
				url: "/dashboard",
				views: {
					"": {
						templateUrl: "/modules/Dashboard/views/dashboard.html",
						controller: "dashboardCtrl",
						resolve: {
							checked: getDetails
						}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
						//controller:"headerCtrl"
					}
				}
			})
			.state('addDetail', {
				url: "/details/addDetail",
				views: {
					"": {
						templateUrl: "/modules/details/views/addDetail.html",
						controller: "detailController",
						resolve: {
							checked: getDetails
						}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
						//controller:"headerCtrl"
					}
				}
			})
			.state('uninstall', {
				url: "/uninstall",
				views: {
					"": {
						templateUrl: "/modules/additionalInfo/views/uninstall.html",
						controller: "uninstallCtrl",
						//resolve:{checked:getDetails}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
						//controller:"headerCtrl"
					}
				}
			})
			.state('terms', {
				url: "/terms",
				views: {
					"": {
						templateUrl: "/modules/additionalInfo/views/terms.html",
						controller: "uninstallCtrl",
						//resolve:{checked:getDetails}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
						//controller:"headerCtrl"
					}
				}
			})
			.state('instruction', {
				url: "/instruction",
				views: {
					"": {
						templateUrl: "/modules/instructions/views/instructions.html",
						controller: "instructionsCtrl",
						//resolve:{checked:getDetails}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
						//controller:"headerCtrl"
					}
				}
			})
			.state('faq', {
				url: "/faq",
				views: {
					"": {
						templateUrl: "/modules/instructions/views/faq.html",
						controller: "instructionsCtrl",
						resolve: {
							checked: getDetails
						}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
						//controller:"headerCtrl"
					}
				}
			})
			.state('gmap', {
				url: "/gmap",
				views: {
					"": {
						templateUrl: "/modules/testingMap/views/map.html",
						controller: "mapCtrl",
						resolve: {
							checked: getDetails
						}

					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
						//controller:"headerCtrl"
					}

				}
			})
			.state('details', {
				url: "/details",
				views: {
					"": {
						templateUrl: "/modules/details/views/getDetail.html",
						controller: "detailController",
						resolve: {
							checked: getDetails
						}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
						//controller:"headerCtrl"
					}
				}
			})
			.state('editDetail', {
				url: "/details/editDetail/:id",
				views: {
					"": {
						templateUrl: "/modules/details/views/addDetail.html",
						controller: "detailController",
						resolve: {
							checked: getDetails
						}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
						//controller:"headerCtrl"
					}
				}
			})
			.state('getAddress', {
				url: "/getAddress",
				views: {
					"": {
						templateUrl: "/modules/details/views/getAddress.html",
						controller: "detailController",
						resolve: {
							checked: getDetails
						}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
						//controller:"headerCtrl"
					}
				}
			})
			.state('getAddressDetail', {
				url: "/getAddressDetail",
				views: {
					"": {
						templateUrl: "/modules/details/views/getAddressDetail.html",
						controller: "detailController",
						resolve: {
							checked: getDetails
						}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
						//controller:"headerCtrl"
					}
				}
			})
			.state('showFilters', {
				url: "/showFilters",
				views: {
					"": {
						templateUrl: "/modules/filters/views/filters.html",
						controller: "filterCtrl",
						resolve: {
							checked: getDetails
						}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
						//controller:"headerCtrl"
					}
				}
			})
			.state('showFields', {
				url: "/showFields",
				views: {
					"": {
						templateUrl: "/modules/fields/views/fields.html",
						controller: "fieldCtrl",
						resolve: {
							checked: getDetails
						}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
						//controller:"headerCtrl"
					}
				}
			})
			.state('showGroups', {
				url: "/showGroups",
				views: {
					"": {
						templateUrl: "/modules/groups/views/groups.html",
						controller: "groupCtrl",
						resolve: {
							checked: getDetails
						}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
						//controller:"headerCtrl"
					}
				}
			})
			.state('addGroup', {
				url: "/addGroup",
				views: {
					"": {
						templateUrl: "/modules/groups/views/adGroup.html",
						controller: "groupCtrl",
						resolve: {
							checked: getDetails
						}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
						//controller:"headerCtrl"
					}
				}
			})
			.state('editGroup', {
				url: "/editGroup/:id",
				views: {
					"": {
						templateUrl: "/modules/groups/views/adGroup.html",
						controller: "groupCtrl",
						resolve: {
							checked: getDetails
						}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
						//controller:"headerCtrl"
					}
				}
			})
			.state('map_api_key', {
				url: "/map_api_key",
				views: {
					"": {
						templateUrl: "/modules/mapkey/views/mapkey.html",
						controller: "mapkeyController",
						resolve: {
							checked: getDetails
						}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
						//controller:"headerCtrl"
					}
				}
			})
			.state('display_settings', {
				url: "/display_settings",
				views: {
					"": {
						templateUrl: "/modules/dispSetting/views/dispSetting.html",
						controller: "dispSettingController",
						resolve: {
							checked: getDetails
						}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
						//controller:"headerCtrl"
					}
				}
			})
			.state('upload', {
				url: "/upload",
				views: {
					"": {
						templateUrl: "/modules/upload/views/upload.html",
						controller: "fileuploadController",
						//resolve:{checked:getDetails}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
						//controller:"headerCtrl"
					}
				}
			})
			.state('customerLookup', {
				url: "/customerLookup",
				views: {
					"": {
						templateUrl: "/modules/customer_lookup/views/lookup.html",
						controller: "lookupCtrl",
						resolve: {
							checked: getDetails
						}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",

					}
				}
			})


	}]).run(['$rootScope', '$location', '$http', '$localStorage', function($rootScope, $location, $http, $localStorage) {

		var referrer = document.referrer;
		if (referrer) {
			referrer = referrer.split('//');
			referrer = referrer[1].split('/');
			referrer = referrer[0];
			window.localStorage.setItem('shopName', referrer);

		} else {
			console.log('not in iframe')
		}
	}]).directive('numbersOnly', function() {
		return {
			require: 'ngModel',
			link: function(scope, element, attr, ngModelCtrl) {
				function fromUser(text) {
					console.log("Text is ", text, typeof text);
					if (text) {
						var transformedInput = text.replace(/[^0-9]/g, '');
						if (transformedInput !== text) {
							ngModelCtrl.$setViewValue(transformedInput);
							ngModelCtrl.$render();
						}
						return transformedInput;
					}
					return undefined;
				}
				ngModelCtrl.$parsers.push(fromUser);
			}
		};
	})