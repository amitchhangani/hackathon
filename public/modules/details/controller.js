"use strict";

angular.module("Details", ['ngMap'])

shopifyApp.controller("detailController", ['$scope', '$rootScope', '$location', 'DetailService', 'groupService', '$stateParams', '$localStorage', 'NgMap', '$timeout', '$confirm', 'NgTableParams',
    function($scope, $rootScope, $location, DetailService, groupService, $stateParams, $localStorage, NgMap, $timeout, $confirm, NgTableParams) {
        $scope.store = {};
        $scope.$watch('store',
            function(newValue, oldValue) {
                console.log('called');
                if (newValue.address != oldValue.address || newValue.city != oldValue.city || newValue.country != oldValue.country || newValue.state != oldValue.state) {
                    console.log(newValue);
                    $scope.address = ($scope.store.address ? ($scope.store.address + ", ") : "") + ($scope.store.city ? ($scope.store.city + ", ") : '') + ($scope.store.state ? $scope.store.state + ", " : '') + ($scope.store.country ? JSON.parse($scope.store.country).name + " " : '');
                    $scope.address = $scope.address.split(',').join(' , ')
                    console.log($scope.address);

                    $scope.position($scope.address);
                }


            }, true
        );
        $scope.workingdaysselection = [];
        var map, marker;
        $scope.store_locator = {
            working_days: []
        };
        $scope.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        if ($rootScope.message2) {
            $scope.alerttype = 'alert alert-success';
            $scope.showmessage = true;
            $scope.message = $rootScope.message2;
            $timeout(function(argument) {
                delete $rootScope.message2;
                $scope.showmessage = false;
            }, 2000)
        }
        $scope.editworkingdays = function(day) {

            var index = $scope.store_locator.working_days.indexOf(day);
            if (index == -1)
                $scope.store_locator.working_days.push(day)
            else
                $scope.store_locator.working_days.splice(index, 1)

            console.log($scope.store_locator.working_days);
        }



        $scope.position = function(value) {
            console.log("position called")
            var geocoder = new google.maps.Geocoder();
            if (geocoder) {
                geocoder.geocode({
                    'address': value
                }, function(result, status) {
                    console.log("result:", result);
                    console.log("status:", status);
                    if (status == google.maps.GeocoderStatus.OK) {
                        $scope.positions = {
                            title: 'Marker 1',
                            pos: [result[0].geometry.location.lat(), result[0].geometry.location.lng()]
                        }

                        console.log("position in change function:", $scope.position);
                        $scope.store.latitude = result[0].geometry.location.lat();
                        $scope.store.longitude = result[0].geometry.location.lng();
                        setTimeout(function() {
                            $scope.$apply()
                        }, 1)
                    }
                });

            }
        }
        $scope.click = function() {
            console.log("marker location:", marker.getPosition().lat(), '\n', marker.getPosition().lng());
            $scope.store.latitude = marker.getPosition().lat();
            $scope.store.longitude = marker.getPosition().lng();
        }

        $scope.$on('mapInitialized', function(event, evtMap) {
            map = evtMap;
            console.log("position:", map.markers);
            marker = map.markers[0];
        });

        $scope.fetchGroups = function() {
                if ($localStorage.id) {
                    var input = {};
                    input.shop_id = $localStorage.id;
                    console.log("data sent45:", input);

                    groupService.fetchGroups(input, function(response) {
                        if (response.messageId == 200) {
                            $scope.groupName = response.data;
                        }
                    });
                }
            }
            /*________________________________________________________________________
                * @Date:            18 June 2015
                * @Method :         Display Stores 
                * Created By:       smartData Enterprises Ltd
                * Modified On:      -
                * @Purpose:         to display stores.
                * @Return:          yes
            _________________________________________________________________________
            */
        $scope.getStores = function() {
            if ($localStorage.id) {
                var input = {};
                input.id = $localStorage.id;
                console.log("input send:", input);

                DetailService.getDetail(input, function(response) {
                    if (response.messageId == 200) {
                        console.log("resonse length:", response);
                        console.log("resonse length:", response.data.length);
                        if (response.data.length < 1) {
                            $scope.showmessage = true;
                            $scope.alerttype = "alert alert-warning"
                            $scope.message = "Oops, sorry no data found";

                        } else {
                            console.log("data:", response.data);

                            $scope.showmessage = false;
                            $scope.showmessage = true;
                            $scope.alerttype = "alert alert-info"
                            $scope.message = "You currently have " + response.data.length + " Stores.";
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
                            $scope.details = response.data;
                        }

                    } else {
                        $scope.showmessage = true;
                        $scope.alerttype = "alert alert-warning"
                        $scope.message = "Error in getting stores data.";
                        $timeout(function(argument) {

                            $scope.showmessage = false;
                        }, 2000)
                    }
                })
            } else {
                $location.path('/home');
            }

        }

        $scope.get = function() {
            if ($localStorage.id) {
                var input = {};
                input.id = $localStorage.id;
                DetailService.getFilter(input, function(response) {
                    $scope.filters = response.data;
                    if ($stateParams.id) {
                        var i = 0;
                        var j = 0;
                        for (i = 0; i < $scope.filters.length; i++) {
                            for (j = 0; j < $scope.store.custom_filters.length; j++) {
                                if ($scope.filters[i]._id == $scope.store.custom_filters[j].filter_id) {
                                    $scope.filters[i].value = $scope.store.custom_filters[j].value;
                                }
                            }
                        }
                    }
                });
            }
        };
        if (!$stateParams.id) {
            $scope.get();
        }

        /*________________________________________________________________________
           * @Date:             13 June 2015
           * @Method :          Add Store 
           * Created By:        smartData Enterprises Ltd
           * Modified On:       -
           * @Purpose:          To add a new store.
         _________________________________________________________________________
         */
        $scope.adddetail = function() {

                $scope.store.shop_id = $localStorage.id;
                console.log("working_days:", $scope.store_locator.working_days);
                //working days
                $scope.store.working_days = $scope.store_locator.working_days;
                //timings
                $scope.store.start_time = new Date($scope.store.start_time).getTime();
                $scope.store.end_time = new Date($scope.store.end_time).getTime();
                $scope.store.filters = $scope.filters;
                $scope.store.fields = $scope.fields;
                $scope.store.location = [$scope.store.latitude, $scope.store.longitude];
                console.log("sent data:", $scope.store);

                DetailService.addDetail($scope.store, function(response) {
                    if (response.messageId == 200) {

                        $rootScope.message2 = response.message;

                        $location.path('/details')
                    } else if (response.messageId == 422) {
                         window.scrollTo(0, 0);
                        $scope.showmessage = true;
                        $scope.alerttype = "alert alert-warning";
                        $scope.message = "Currently you are using free plan,for using more facilities you have to upgrade your plan";
                    } else if (response.messageId == 423) {
                         window.scrollTo(0, 0);
                        $scope.showmessage = true;
                        $scope.alerttype = "alert alert-warning";
                        $scope.message = "Currently you are using Intermediate plan,for using more facilities you have to upgrade your plan";
                    } else {
                        window.scrollTo(0, 0);
                        $scope.showmessage = true;
                        $scope.alerttype = "alert alert-danger";
                        $scope.message = response.message;
                        $timeout(function(argument) {
                            $scope.showmessage = false;
                        }, 2000)

                    }
                })

            }
            //************Show Address,Detail in Store List***********
        $scope.showAddress = function(data) {
            $scope.currentAddress = data;
        }
        $scope.showDetail = function(data) {
                $scope.currentStore = data;
            }
            /*________________________________________________________________________
               * @Date:             14 June 2015
               * @Method :          Add Filter
               * Created By:        smartData Enterprises Ltd
               * Modified On:       -
               * @Purpose:          to add a new filter.
             _________________________________________________________________________
             */
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
                            $scope.messagefilter = "";
                            $scope.get();
                            $scope.store.filter = "";
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
        /*________________________________________________________________________
              * @Date:              16 June 2015
              * @Method :           Delete Filter 
              * Created By:         smartData Enterprises Ltd
              * Modified On:        -
              * @Purpose:           to delete filter.
            _________________________________________________________________________
            */
        $scope.deletefilter = function(id) {
            $confirm({
                    text: 'Are you sure you want to delete filter?'
                })
                .then(function() {
                    DetailService.deleteFilter({
                        'id': id
                    }, function(response) {
                        $scope.get();
                    })
                });

        }
        $scope.myVar = false;
        $scope.toggle = function() {
            $scope.myVar = !$scope.myVar;
        };

        //****************Field***************************************
        /*________________________________________________________________________
           * @Date:             13 June 2015
           * @Method :          Add Field 
           * Created By:        smartData Enterprises Ltd
           * Modified On:       -
           * @Purpose:          To add a new field
           * @Return:           yes
         ________________________________________________________________________*/
        $scope.addfield = function() {
            console.log("Logged In:", $localStorage)
            if ($localStorage) {
                $scope.store.shop_id = $localStorage.id;
                DetailService.addField($scope.store, function(response) {
                    if (response.messageId == 200) {
                        console.log(response);

                        $scope.showmessagefield = true;
                        $scope.alerttypefield = "alert alert-success"
                        $scope.messagefield = response.message;
                        $timeout(function(argument) {
                            $scope.showmessagefield = false;
                            $scope.messagefield = "";
                            $scope.getfield();
                            $scope.store.field = "";
                        }, 2000)

                    } else {
                        $scope.showmessagefield = true;
                        $scope.alerttypefield = "alert alert-danger"
                        $scope.messagefield = response.message
                        $timeout(function(argument) {

                            $scope.showmessagefield = false;
                            $scope.messagefield = "";
                            $scope.store.field = "";
                        }, 2000)

                    }
                })
            }
        };
        /*________________________________________________________________________
               * @Date:             13 June 2015
               * @Method :          Display Field 
               * Created By:        smartData Enterprises Ltd
               * Modified On:       -
               * @Purpose:          To display fields
               * @Return:           yes
             _________________________________________________________________________
             */
        $scope.getfield = function() {
            if ($localStorage.id) {
                var input = {};
                input.id = $localStorage.id;
                DetailService.getField(input, function(response) {
                    $scope.fields = response.data;

                    if ($stateParams.id) {
                        var i = 0;
                        var j = 0;
                        for (i = 0; i < $scope.fields.length; i++) {
                            for (j = 0; j < $scope.store.custom_fields.length; j++) {
                                if ($scope.fields[i]._id == $scope.store.custom_fields[j].field_id) {
                                    $scope.fields[i].description = $scope.store.custom_fields[j].field_detail;
                                }
                            }
                        }
                    }
                });
            }
        };
        if (!$stateParams.id) {
            $scope.getfield();
        }

        $scope.myVar1 = false;
        $scope.toggle1 = function() {
            $scope.myVar1 = !$scope.myVar1;
        };
        /*________________________________________________________________________
                   * @Date:             16 June 2015
                   * @Method :          Delete Store 
                   * Created By:        smartData Enterprises Ltd
                   * Modified On:       -
                   * @Purpose:          To delete stores.
         _______________________________________________________________________ */
        $scope.deletedetail = function(id) {
                $confirm({
                        text: 'Are you sure you want to delete store?'
                    })
                    .then(function() {
                        var inputJson = {
                            'id': id,
                            'shop_id': $localStorage.id
                        };
                        console.log("input:", inputJson);

                        DetailService.deleteDetail(inputJson, function(response) {
                            $scope.getStores();
                        })
                    });

            }
            //to delete custom fields
        $scope.deletefield = function(id) {
            $confirm({
                    text: 'Are you sure you want to delete store?'
                })
                .then(function() {
                    DetailService.deleteField({
                        'id': id
                    }, function(response) {

                        $scope.getfield();

                    })
                });

        }

        /*________________________________________________________________________
                   * @Date:             16 June 2015
                   * @Method :          Update Store 
                   * Created By:        smartData Enterprises Ltd
                   * Modified On:       -
                   * @Purpose:          To update a store.
                   * @Return:           yes
        __________________________________________________________________*/
        if ($stateParams.id) {
            $scope.id = $stateParams.id;
            DetailService.getShopDetail({
                id: $stateParams.id
            }, function(response) {
                if (response.messageId == 200) {
                    console.log("response.data is", response.data);
                    $scope.store = response.data;
                    $scope.store.country = JSON.stringify(response.data.country_id);
                    $scope.store.start_time = new Date(response.data.start_time);
                    $scope.store.end_time = new Date(response.data.end_time);
                    $scope.workingdaysselection = response.data.working_days;
                    $scope.get();
                    $scope.getfield();
                } else {
                    // alert(1);
                }
            })
        }

        /*________________________________________________________________________
           * @Date:             14 June 2015
           * @Method :          Display Countries
           * Created By:        smartData Enterprises Ltd
           * Modified On:       -
           * @Purpose:          to get the list of countries names.
           * @Return:           yes
         _________________________________________________________________________
         */
        if ($location.path() !== '/details') {
            DetailService.getLocation(function(response) {
                $scope.countries = response.data;
                if ($stateParams.id) {
                    setTimeout(function() {
                        $scope.getState();
                    }, 10)
                }
            });
        }
        /*________________________________________________________________________
               * @Date:             14 June 2015
               * @Method :          Display States
               * Created By:        smartData Enterprises Ltd
               * Modified On:       -
               * @Purpose:          to get the list of states names.
               * @Return:           yes
            _____________________________________________________________________*/
        $scope.getState = function() {
            var data = JSON.parse($scope.store.country);
            console.log(data);
            if (data.location_id && data.location_id !== undefined) {
                DetailService.getState({
                    country_id: data.location_id
                }, function(response) {

                    $scope.states = response.data;
                });
            }
        }
    }
]).directive('phoneInput', function($filter, $browser) {
    return {
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModelCtrl) {
            var listener = function() {
                var value = $element.val().replace(/[^0-9]/g, '');
                $element.val($filter('tel')(value, false));
            };

            // This runs when we update the text field
            ngModelCtrl.$parsers.push(function(viewValue) {
                return viewValue.replace(/[^0-9]/g, '').slice(0, 10);
            });

            // This runs when the model gets updated on the scope directly and keeps our view in sync
            ngModelCtrl.$render = function() {
                $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
            };

            $element.bind('change', listener);
            $element.bind('keydown', function(event) {
                var key = event.keyCode;
                // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                // This lets us support copy and paste too
                if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) {
                    return;
                }
                $browser.defer(listener); // Have to do this or changes don't get picked up properly
            });

            $element.bind('paste cut', function() {
                $browser.defer(listener);
            });
        }

    };
}).filter('tel', function() {
    return function(tel) {

        if (!tel) {
            return '';
        }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 1:
            case 2:
            case 3:
                city = value;
                break;

            default:
                city = value.slice(0, 3);
                number = value.slice(3);
        }

        if (number) {
            if (number.length > 3) {
                number = number.slice(0, 3) + '-' + number.slice(3, 7);
            } else {
                number = number;
            }

            return ("(" + city + ") " + number).trim();
        } else {
            return "(" + city;
        }

    };
})