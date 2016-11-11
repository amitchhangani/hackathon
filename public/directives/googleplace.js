angular.module('hackathon').directive('googleplace', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {}
            };
            //console.log(element,element[0])
            //scope.gPlace = [];
            scope['gPlace'+parseInt(attrs.index)] = new google.maps.places.Autocomplete(element[0], options);
            //console.log(parseInt(attrs.index));
            //console.log(scope['gPlace'+parseInt(attrs.index)])
            google.maps.event.addListener(scope['gPlace'+parseInt(attrs.index)], 'place_changed', function() {
                scope.$apply(function() {
                    model.$setViewValue(element.val());
                    var details = scope['gPlace'+parseInt(attrs.index)].getPlace();
                    console.log(details);
                    if(attrs.setothers == "true"){
                        var variable = attrs.setvariable ? attrs.setvariable : 'patient';
                        angular.element(element).val(details.name+', '+details.formatted_address);
                        scope[variable].cityState = "";
                        var gotCity = false;
                        var gotState = false;
                        var gotZip = false;
                        var gotCountry = false;
                        for (var i = 0; i < details.address_components.length; i++) {
                            var addressType = details.address_components[i].types[0];
                            var val = details.address_components[i].long_name;
                            if(addressType == 'country'){
                                scope[variable].country = val;
                                gotCountry = true;
                            }
                            if (addressType == 'administrative_area_level_1' || addressType == 'locality' || addressType == 'postal_code') {
                                if(addressType == 'administrative_area_level_1'){
                                    scope[variable].state = val;
                                    gotState = true;
                                }
                                if(addressType == 'locality'){
                                    scope[variable].city = val;
                                    gotCity = true;
                                }
                                
                                if(addressType == 'postal_code'){
                                    scope[variable].zip = val;
                                    gotZip = true;
                                }
                                scope[variable].cityState = (scope[variable].cityState ? scope[variable].cityState +', ' : "") + val;
                            }
                        }
                        if(!gotCountry){
                            scope[variable].country = '';
                        }
                        if(!gotState){
                            scope[variable].state = '';
                        }
                        if(!gotCity){
                            scope[variable].city = '';
                        }
                        if(!gotZip){
                            scope[variable].zip = '';
                        }
                        if(attrs.update == 'true'){
                            var data = {};
                            data.patient_id = scope[variable].id;
                            data.fields = [];
                            data.fields[0] = {}
                            data.fields[0].field = 'address';
                            data.fields[0].value = scope[variable].address;
                            data.fields[1] = {}
                            data.fields[1].field = 'city';
                            data.fields[1].value = scope[variable].city;
                            data.fields[2] = {}
                            data.fields[2].field = 'zip';
                            data.fields[2].value = scope[variable].zip;
                            data.fields[3] = {}
                            data.fields[3].field = 'country';
                            data.fields[3].value = scope[variable].country;
                            data.fields[4] = {}
                            data.fields[4].field = 'state';
                            data.fields[4].value = scope[variable].state;
                            scope.finalStep(data)
                        }
                    }else{
                        angular.element(element).val(details.name+', '+details.formatted_address);
                    }
                });
            });
        }
    };
});