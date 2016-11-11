 "use strict";

var shopifyApp = angular.module('shopifyApp', ['ui.router'])
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise("/");
		$stateProvider
			.state('home', {
				url: "/",
				views: {
					"": {
						template: "",
                    }
				}
			})
		
	}]).run(['$rootScope', '$location', '$http',  function($rootScope, $location, $http) {
		console.log('inside function');

		$http.get('/sessionGet').then(function(response) {
			console.log("response:", response);
			if (response.data.messageId == 200) {
				window.location.href= "https://"+response.data.data.shop+"/admin/apps/"+inputJson.shopify_api_key;
			}else{
				window.location.href = "https://www.shopify.com/login"
			}        
        });
	}])