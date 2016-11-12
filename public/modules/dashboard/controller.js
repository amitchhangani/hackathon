"use strict"
hackathon.controller("dashboardController", [ '$scope','$http','$state','$rootScope','NgMap','GeoCoder',function($scope,$http,$state,$rootScope,NgMap,GeoCoder) {
	//alert('cityController');
	$scope.map= {};
	$scope.location = {};
	$scope.allVCount = {totalCapacity : 0};
	
		$http.get('/fetchvehicles').then(function(response) {
			if(response.data.status == 1) {
				$scope.allVCount.count = response.data.data.length;
				for(var i = 0; i < response.data.data.length; i++){
					$scope.allVCount.totalCapacity = parseInt(response.data.data[i].capacity) +$scope.allVCount.totalCapacity;
				}
			}
		})
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
                text: 'Vehicle vise Garbage Trend Analysis'
              },

              xAxis: {
                    categories: a
                },
                yAxis: {
                    title: {
                        text: 'Vehicle occupied'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: 'Full'
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
	
	
	$scope.getGCStats = function(){  	
			  $http({
				method: 'GET',
				url: '/fetchGCStats'
			  }).then(function(gcStats){
					if(gcStats.data.data){
				  gcStats=gcStats.data.data;
				  var cats=[];
				  var catsid=[];
				  for(var i=0; i<gcStats.length; i++){
					  cats.push(gcStats[i].gc[0][0].name);
					  catsid.push(gcStats[i]._id);
				  }
				  console.log('cats',cats)
				  var series=[];
				  var dat={};
				  var options = ['full','half','empty'];
				  for(var i=0; i< options.length; i++){
					  series.push({name:options[i]});
					  series[i].data=[];
					  for(var j=0; j<gcStats.length; j++){
						if(gcStats[j][options[i]]){
							series[i].data.push(gcStats[j][options[i]]);							
						}else{
							series[i].data.push(0);							
						}
						  
						}
					  
				  }
				  var a=[];
				  for(i in dat){
					  a.push(i);
				  }
	  
				  Highcharts.chart('container2', {
					chart: {
						type: 'column'
					},
					title: {
						text: 'Collection Point based garbage collection'
					},
					subtitle: {
						text: 'garbage collection trend analysis'
					},
					xAxis: {
						categories: cats,
						crosshair: true
					},
					yAxis: {
						min: 0,
						title: {
							text: 'Counts'
						}
					},
					tooltip: {
						headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
						pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
							'<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
						footerFormat: '</table>',
						shared: true,
						useHTML: true
					},
					plotOptions: {
						column: {
							pointPadding: 0.2,
							borderWidth: 0
						}
					},
					series: series
				});
					}else{
						
					}
			});
	}
	$scope.getGCStats();
    //Highchart ends

	
}])