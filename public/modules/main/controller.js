"use strict"
hackathon.controller("mainController", [ '$scope','$http','$state','$rootScope',function($scope,$http,$state,$rootScope) {
	//alert('cityController');
	$http.get('/fetchCity').then(function (response) {
        if(response.data.data){
            $rootScope.city = response.data.data;
			console.log('id = ',$rootScope.city);
        }else{
            $state.go('addCity');
        }
    }, function (response) {
        alert('error while getting api data');
    })
}])