"use strict"
angular.module("fileupload")
.factory('fileuploadService', ['$http', 'communicationService', function($http, communicationService) {
	var service = {};

	service.uploads = function(postData, callback) {
			// communicationService.resultViaPost(webservices.uploads, headerConstants.json, postData, function(response) {
			// 	callback(response.data);
			// });

			 $http.post(webservices.uploads, postData, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    },
                }).then(callback);
		}

	
	return service;
}]);