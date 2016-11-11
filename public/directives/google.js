hackathon.directive('googleplace123', function() { 
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            console.log('linked');
            var options = {
                types: [],
                componentRestrictions: {country: 'in'}
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
            
            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                
                scope.details = scope.gPlace.getPlace();
                scope.details.lat = scope.details.geometry.location.lat();
                scope.details.lng = scope.details.geometry.location.lng();
                scope.$apply(function() {
                    console.log('on place change');
                    scope.showOthers = true;
                    model.$setViewValue(element.val());                
                });
            });

        }
    };
});