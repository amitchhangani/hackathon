"use strict";
angular.module("fileupload");
shopifyApp.controller("fileuploadController", ['$scope', '$localStorage', '$http', '$location', 'fileuploadService', '$window',
  function($scope, $localStorage, $http, $location, fileuploadService, $window) {
    var file;
    var fileNameArr = [];


    $scope.fileUpload = function() {
      if ($scope.obj) {
        file = $scope.obj.myfiles;
        fileNameArr = file.name.substr(file.name.lastIndexOf('.') + 1);

        if (fileNameArr == "csv" || fileNameArr == "CSV") {
          var fd = new FormData();
          fd.append('file', file);
          fd.append('shop_id', $localStorage.id);
          fileuploadService.uploads(fd, function(response) {
            console.log(response)
            if (response.data.messageId = 200 && response.data.status != 'Failure') {
              console.log("success");
              $scope.ModalMsg = response.data.result;
              console.log(response.data.result)
                // $scope.showmessage = true;
              $('.modal').modal('show');
            } else {
              $scope.showmessage = true;
              $scope.alerttype = "alert alert-danger"
              $scope.message = response.data.message;
              // alert(response.data.message)
            }
          })
        } else {
          alert("Error! Uploading file should be csv format only!");
        }
      } else {
        $scope.showmessage = true;
        $scope.alerttype = "alert alert-danger"
        $scope.message = "Please select csv file";
      }
    };
    $scope.downloadCsv = function() {
      var s = baseUrl + "/doc/template.csv";
      $window.open(s);
    }
  }
]).directive('fileModel', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;

      element.bind('change', function() {
        scope.$apply(function() {
          modelSetter(scope, element[0].files[0]); //use for only one file
          // modelSetter(scope, element[0].files); // use for multiple files
        });
      });
    }
  };

}])