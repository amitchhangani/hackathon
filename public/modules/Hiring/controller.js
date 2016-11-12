"use strict"
hackathon.controller("hiringController", [ '$scope','$http','$state','$rootScope','NgMap','GeoCoder',function($scope,$http,$state,$rootScope,NgMap,GeoCoder) {
	//alert('cityController');
	$scope.map= {};
	$scope.location = {};
	var totalUsers = {};
	$scope.allVCount = {};
	$scope.allVCount.count = 0;
	$scope.sweeperStats = {required : 0,aligned:0,total:0};
	$scope.driverStats = {required : 0,aligned:0,total:0};
	$scope.getAllUsers = function(){ 
		$http.get('/fetchusers').then(function(response) {
			$scope.tableDataLength = response.data.data.length;
			if(response.data.status == 1) {
				$scope.driverStats.aligned = response.data.data.length- $scope.sweeperStats.aligned;
				$http.get('/fetchvehicles').then(function(response) {
					if(response.data.status == 1) {
						$scope.allVCount.count = response.data.data.length;
						console.log('----------------',$scope.allVCount)
						$scope.driverStats.required = response.data.data.length;
						$scope.driverStats.hiring = response.data.data.length-$scope.driverStats.aligned;
						console.log('$scope.driverStats--------',$scope.driverStats)
						Highcharts.chart('container2', {
							chart: {
								type: 'bar'
							},
							title: {
								text: 'Drivers Required'
							},
							xAxis: {
								categories: ['Drivers'],
								title: {
									text: null
								}
							},
							yAxis: {
								min: 0,
								title: {
									text: '',
									align: 'high'
								},
								labels: {
									overflow: 'justify'
								}
							},
							tooltip: {
								valueSuffix: ' '
							},
							plotOptions: {
								bar: {
									dataLabels: {
										enabled: true
									}
								}
							},
							legend: {
								layout: 'vertical',
								align: 'right',
								verticalAlign: 'top',
								x: -40,
								y: 80,
								floating: true,
								borderWidth: 1,
								backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
								shadow: true
							},
							credits: {
								enabled: false
							},
							series: [{
								name: 'Available',
								data: [$scope.driverStats.aligned]
							}, {
								name: 'Required',
								data: [ $scope.driverStats.required]
							},{
							  name:'Still need Hiring',
								data: [$scope.driverStats.needHiring]
							}]
						});
					} else {
						toaster.pop('error', "Oops! something went wrong.", "error while fetching vehicles, make sure you have added vehicle information.");
					}
				});
			} else {
				toaster.pop('error', "Oops! something went wrong.", "error while fetching user.");
			}
		});
	}
	//$scope.getAllUsers();
	
	$scope.sweeperStats = {required : 0,aligned:0, needHiring:0};
	$scope.fetchCollectionCener =  function(){
		$http.get('/fetchCity').then(function (response) {
			if(response.data.data){
				$rootScope.city = response.data.data;
				for (var i  = 0; i< $rootScope.city.collectionCenters.length; i++){
					$scope.sweeperStats.required = $scope.sweeperStats.required + $rootScope.city.collectionCenters[i].sweeperCapacity;
					$scope.sweeperStats.aligned = $scope.sweeperStats.aligned +  $rootScope.city.collectionCenters[i].users.length;
				}
				$scope.sweeperStats.needHiring = $scope.sweeperStats.required -$scope.sweeperStats.aligned;
				console.log('$scope.sweeperStats--------',$scope.sweeperStats);
				$scope.getAllUsers();
				 Highcharts.chart('container', {
					chart: {
						type: 'bar'
					},
					title: {
						text: 'Sweepers Required'
					},
					xAxis: {
						categories: ['Sweepers'],
						title: {
							text: null
						}
					},
					yAxis: {
						min: 0,
						title: {
							text: '',
							align: 'high'
						},
						labels: {
							overflow: 'justify'
						}
					},
					tooltip: {
						valueSuffix: ' '
					},
					plotOptions: {
						bar: {
							dataLabels: {
								enabled: true
							}
						}
					},
					legend: {
						layout: 'vertical',
						align: 'right',
						verticalAlign: 'top',
						x: -40,
						y: 80,
						floating: true,
						borderWidth: 1,
						backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
						shadow: true
					},
					credits: {
						enabled: false
					},
					series: [{
						name: 'Available',
						data: [$scope.sweeperStats.aligned]
					}, {
						name: 'Required',
						data: [ $scope.sweeperStats.required]
					},{
					  name:'Still need Hiring',
						data: [$scope.sweeperStats.needHiring]
					}]
				});
				
				
			}else{
				//$state.go('addCity');
			}
		}, function (response) {
			alert('error while getting api data');
		})
	}
	$scope.fetchCollectionCener();
	$scope.drawSweeperChart = function(){
		//for(var i = 0; )
	}
	//Highchart starts
//	$http({
//      method: 'GET',
//      url: '/fetchvehicles'
//    }).then(function successCallback(vehicles){    	
//        $http({
//          method: 'GET',
//          url: '/fetchVehicleStats'
//        }).then(function successCallback(vehicleStats){
//        	vehicleStats=vehicleStats.data;
//            var cats=[];
//            var catsid=[];
//            vehicles=vehicles.data.data;
//            for(var i=0; i<vehicles.length; i++){
//                cats.push(vehicles[i].name);
//                catsid.push(vehicles[i]._id);
//            }
//            var series=[];
//            var dat={};
//            for(var i=0; i<catsid.length; i++){
//                series.push({name:cats[i]});
//                series[i].data=[];
//                for(var j=0; j<vehicleStats.length; j++){
//                    if(catsid[i].toString()==vehicleStats[j].vehicle._id.toString()){
//                        series[i].data.push(vehicleStats[j].vehicleStatus);
//                        dat[i]=i;
//                    }
//                }
//            }
//            var a=[];
//            for(i in dat){
//                a.push(i);
//            }
//
//            Highcharts.chart('container', {
//              title: {
//                text: 'Vehicle vise Garbage Trend Analysis'
//              },
//
//              xAxis: {
//                    categories: a
//                },
//                yAxis: {
//                    title: {
//                        text: 'Vehicle occupied'
//                    },
//                    plotLines: [{
//                        value: 0,
//                        width: 1,
//                        color: '#808080'
//                    }]
//                },
//                tooltip: {
//                    valueSuffix: 'Full'
//                },
//                legend: {
//                    layout: 'vertical',
//                    align: 'right',
//                    verticalAlign: 'middle',
//                    borderWidth: 0
//                },
//                series: series
//            });
//        },
//        function errorCallback(err){
//
//        })
//    },
//    function errorCallback(err){
//        
//    })
//	
//	
//	$scope.getGCStats = function(){  	
//			  $http({
//				method: 'GET',
//				url: '/fetchGCStats'
//			  }).then(function successCallback(gcStats){
//				  gcStats=gcStats.data.data;
//				  var cats=[];
//				  var catsid=[];
//				  for(var i=0; i<gcStats.length; i++){
//					  cats.push(gcStats[i].gc[0][0].name);
//					  catsid.push(gcStats[i]._id);
//				  }
//				  console.log('cats',cats)
//				  var series=[];
//				  var dat={};
//				  var options = ['full','half','empty'];
//				  for(var i=0; i< options.length; i++){
//					  series.push({name:options[i]});
//					  series[i].data=[];
//					  for(var j=0; j<gcStats.length; j++){
//						if(gcStats[j][options[i]]){
//							series[i].data.push(gcStats[j][options[i]]);							
//						}else{
//							series[i].data.push(0);							
//						}
//						  
//						}
//					  
//				  }
//				  var a=[];
//				  for(i in dat){
//					  a.push(i);
//				  }
//	  
//				  Highcharts.chart('container2', {
//					chart: {
//						type: 'column'
//					},
//					title: {
//						text: 'Collection Point based garbage collection'
//					},
//					subtitle: {
//						text: 'garbage collection trend analysis'
//					},
//					xAxis: {
//						categories: cats,
//						crosshair: true
//					},
//					yAxis: {
//						min: 0,
//						title: {
//							text: 'Counts'
//						}
//					},
//					tooltip: {
//						headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
//						pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
//							'<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
//						footerFormat: '</table>',
//						shared: true,
//						useHTML: true
//					},
//					plotOptions: {
//						column: {
//							pointPadding: 0.2,
//							borderWidth: 0
//						}
//					},
//					series: series
//				});
//			});
//	}
//	$scope.getGCStats();
    //Highchart ends

	
}])