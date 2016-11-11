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
angular.module("fields", []);
angular.module("filters", []);

var shopifyApp = angular.module('shopifyApp', ['ui.router', 'ngStorage', 'ngMap', 'main', 'home', 'communicationModule', 'payment', 'dashboard', 'Details', 'mapkey', 'dispSetting', 'uninstall', 'instructions', 'map', 'groups', 'fileupload', 'ngSanitize', 'lookup', 'ngTable', 'fields', 'filters'])
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		var storeLocation = function() {
			$localStorage.lastURL = $location.path();
		}
		var login = function($http, data, deferred) {
			console.log('insideLogin', data, inputJson);
			inputJson.shop = data;
			window.localStorage.setItem('shopName', data);
			$http.post(baseUrl + "/authenticate/auth", inputJson).then(function(response) {
				console.log(1, response.data.nonce, response);
				console.log(response.data.nonce == inputJson.nonce)
				console.log(response.data.nonce + " ==" + inputJson.nonce)
				if (response.data.messageId == 200) {
					if (response.data.data.nonce == inputJson.nonce) {
						top.window.location.href = response.data.auth_url;
					}
				}
			})
		}

		var getDetailsToDashboard = function($q, $http, $location, $localStorage, $rootScope) {
			console.log('inside function')
			var deferred = $q.defer();
			var referrer = document.referrer;
			var inIframe = false
			if (referrer) {
				console.log('has referrer')
				referrer = referrer.split('//');
				referrer = referrer[1].split('/');
				referrer = referrer[0];
				window.localStorage.setItem('shopName', referrer);
				inIframe = true;
			}
			if (!inIframe) {
				console.log('!inIframe');
				setTimeout(function() {
					deferred.reject();
				}, 0);
				console.log('not in iframe', baseUrl);
				top.window.location.href = baseUrl + '/goToIframe';
			} else {
				console.log('in else');
				$http.get('/sessionGet').then(function(response) {
					console.log("response:", response);
					if (response.data.messageId == 200) {
						if (!response.data.data.payment_recieved) {
							console.log("in second if");
							$localStorage.id = response.data.data._id
							var path = '/paymentScreen/';
							setTimeout(function() {
								deferred.reject();
							}, 0);
							$location.path(path);
						} else {
							$localStorage.id = response.data.data._id;
							var path = "/dashboard";
							$localStorage.lastURL = path;
							setTimeout(function() {
								deferred.resolve();
								$location.path(path);
							}, 0);


						}


					} else {
						setTimeout(function() {
							deferred.reject();
						}, 0);
						//console.log('at path /')
						login($http, referrer, deferred)

					}
					return deferred.promise;
				})

			}
		}



		var getDetails = function($q, $http, $location, $localStorage, $rootScope) {
			var inIframe = false
			var deferred = $q.defer();
			var referrer = document.referrer;
			if (referrer) {
				referrer = referrer.split('//');
				referrer = referrer[1].split('/');
				referrer = referrer[0];
				window.localStorage.setItem('shopName', referrer);
				inIframe = true;
			}
			if (!inIframe) {
				setTimeout(function() {
					deferred.reject();
				}, 0);
				console.log('not in iframe', baseUrl);
				window.location.href = baseUrl + '/goToIframe';
			} else {
				if ($location.path() == '/') {
					login(referrer, deferred)
				} else {
					var deferred = $q.defer();
					$http.get('/sessionGet').then(function(response) {
						console.log("response:", response);
						if (response.data.messageId == 200) {
							if (!response.data.data.payment_recieved) {
								$localStorage.shopName = response.data.data.shop;
								$localStorage.id = response.data.data._id
								var path = '/paymentScreen/' + response.data.data._id;
								$localStorage.lastURL = path;
								setTimeout(function() {
									$location.path(path);
									deferred.reject();
								}, 0);

							} else {

								$localStorage.id = response.data.data._id;
								console.log('resolving current path');
								setTimeout(function() {
									$localStorage.lastURL = $location.path();
									deferred.resolve();
								}, 0);
							}


						} else {
							setTimeout(function() {
								deferred.reject();
							}, 0);
						
							login($http, referrer, deferred)
						}
						return deferred.promise;
					})
				}
			}
		}


		var checkLogin = function($q, $http, $location, $localStorage, $rootScope) {
			var inIframe = false;
			var deferred = $q.defer();
			var referrer = document.referrer;
			if (referrer) {
				referrer = referrer.split('//');
				referrer = referrer[1].split('/');
				referrer = referrer[0];
				window.localStorage.setItem('shopName', referrer);
				inIframe = true;
			}
			if (!inIframe) {
				setTimeout(function() {
					deferred.reject();
				}, 0);
				console.log('not in iframe', baseUrl);
				window.location.href = baseUrl + '/goToIframe';
			} else {
				if ($location.path() == '/') {

					login(referrer, deferred)
				} else {
					var deferred = $q.defer();
					$http.get('/sessionGet').then(function(response) {
						console.log("response:", response);
						if (response.data.messageId == 200) {
							$localStorage.id = response.data.data._id;
							console.log('resolving current path');
							$localStorage.lastURL = $location.path();
							setTimeout(function() {
								$localStorage.lastURL = $location.path();
								deferred.resolve();
							}, 0);

						} else {
							setTimeout(function() {
								deferred.reject();
							}, 0);
							//$location.path('/');
							login($http, referrer, deferred)
						}
						return deferred.promise;
					})
				}
			}
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
					"header": {
						templateUrl: "/modules/header/views/header.html",
					}
				}
			})

		.state('dashboard', {
				url: "/dashboard",
				views: {
					"": {
						templateUrl: "/modules/Dashboard/views/dashboard.html",
						controller: "detailController",
						resolve: {
							checked: checkLogin
						}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
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
							checked: checkLogin
						}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
					}
				}
			})
			.state('uninstall', {
				url: "/uninstall",
				views: {
					"": {
						templateUrl: "/modules/additionalInfo/views/uninstall.html",
						controller: "uninstallCtrl",
						resolve: {
							checked: storeLocation
						}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
					}
				}
			})
			.state('terms', {
				url: "/terms",
				views: {
					"": {
						templateUrl: "/modules/additionalInfo/views/terms.html",
						controller: "uninstallCtrl",
						resolve: {
							checked: storeLocation
						}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
					}
				}
			})
			.state('instruction', {
				url: "/instruction",
				views: {
					"": {
						templateUrl: "/modules/instructions/views/instructions.html",
						controller: "instructionsCtrl",
						resolve: {
							checked: storeLocation
						}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
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
							checked: storeLocation
						}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
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
							checked: checkLogin
						}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
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
							checked: checkLogin
						}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
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
					}
				}
			})
			.state('upload', {
				url: "/upload",
				views: {
					"": {
						templateUrl: "/modules/upload/views/upload.html",
						controller: "fileuploadController",
						resolve: {
							checked: getDetails
						}
					},
					"header": {
						templateUrl: "/modules/header/views/header.html",
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
		var location = $location.path();
		console.log(location.indexOf('/gmap'))
		console.log($localStorage.lastURL && $location.path() != '/' && location.indexOf('/gmap') == -1);
		if ($localStorage.lastURL && $location.path() != '/' && location.indexOf('/gmap') == -1) {
			$location.path($localStorage.lastURL)
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