"use strict"
hackathon.controller("dashboardController", [ '$scope','$http','$state','$rootScope','NgMap','GeoCoder',function($scope,$http,$state,$rootScope,NgMap,GeoCoder) {
	//alert('cityController');
	$scope.map= {};
	$scope.location = {};
	

	//Highchart starts
	$http({
      method: 'GET',
      url: '/fetchvehicles'
    }).then(function successCallback(vehicles){    	
        $http({
          method: 'GET',
          url: '/fetchVehicleStats'
        }).then(function successCallback(vehicleStats){
        	vehicleStats=vehicleStats.data;
            var cats=[];
            var catsid=[];
            vehicles=vehicles.data.data;
            for(var i=0; i<vehicles.length; i++){
                cats.push(vehicles[i].name);
                catsid.push(vehicles[i]._id);
            }
            var series=[];
            var dat={};
            for(var i=0; i<catsid.length; i++){
                series.push({name:cats[i]});
                series[i].data=[];
                for(var j=0; j<vehicleStats.length; j++){
                    if(catsid[i].toString()==vehicleStats[j].vehicle._id.toString()){
                        series[i].data.push(vehicleStats[j].vehicleStatus);
                        dat[i]=i;
                    }
                }
            }
            var a=[];
            for(i in dat){
                a.push(i);
            }

            Highcharts.chart('container', {
              title: {
                text: 'Temperature Data'
              },

              xAxis: {
                    categories: a
                },
                yAxis: {
                    title: {
                        text: 'Temperature (°C)'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: '°C'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: series
            });
        },
        function errorCallback(err){

        })
    },
    function errorCallback(err){
        
    })
    //Highchart ends

	/* ADD City */
	$scope.addCity = function(){
		console.log($scope.map,$scope.details);
		var postdata = {};
		postdata.lat = $scope.details.lat;
		postdata.long = $scope.details.lng;
		postdata.name = $scope.details.name;
		$http.post('/createCity', postdata)
		.then(
			function(response) {				
				if(response.data.status == 1){
					$rootScope.city = response.data.data;
					console.log('id = ',$rootScope.city);
					$state.go('city');
					
				}else{
					alert('error while adding city');
				}
			}
		);
	}
	
	
	
}])