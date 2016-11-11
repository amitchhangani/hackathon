"use strict";
angular.module("groups")
shopifyApp.controller("groupCtrl", ['$window', '$scope', '$rootScope', '$localStorage', 'groupService', '$timeout', '$location', '$confirm', 'NgTableParams', function($window, $scope, $rootScope, $localStorage, groupService, $timeout, $location, $confirm, NgTableParams) {
    $scope.addGroup = function() {
        var input = {};
        input.group_name = $scope.store.group_name;
        input.color = $scope.store.color;
        input.shop_id = $localStorage.id;

        if ($scope.store.hide == 'hide') {
            input.hide = $scope.store.hide == 'never' ? $scope.store.hide : $scope.store.hideValue;
        }
        if ($scope.store.hide == 'never') {
            input.never = false;
        }
        console.log("data:", input);

        groupService.addGroup(input, function(response) {

            if (response.messageId == 200) {
                $scope.showmessageModal = true;
                $scope.alerttypeModal = "alert alert-success";
                $scope.messageModal = response.message;
                $timeout(function(argument) {

                    $scope.showmessageModal = false;

                    $('#myModal').modal('hide');

                    $scope.loadGroups();

                }, 2000)


            } else {
                $scope.showmessageModal = true;
                $scope.alerttypeModal = "alert alert-danger";
                $scope.messageModal = response.message;
                $timeout(function(argument) {

                    $scope.showmessageModal = false;
                    $scope.message = "";
                    $scope.store.group_name = "";
                    $scope.store.color = "";
                     $scope.loadGroups();



                }, 2000)


            }
        })

    }
    $scope.editGroup = function(value) {
        console.log("value of group id:", value);

        var input = {};
        input.group_name = $scope.store.group_name;
        input.color = $scope.store.color;
        input.shop_id = $localStorage.id;
        input.group_id = value;

        if ($scope.store.hide == 'hide') {
            input.hide = $scope.store.hide == 'never' ? $scope.store.hide : $scope.store.hideValue;
        }
        if ($scope.store.hide == 'never') {
            input.never = true;
        }
        console.log("data:", input);

        groupService.editGroup(input, function(response) {

            if (response.messageId == 200) {
                $scope.showmessageModal = true;
                $scope.alerttypeModal = "alert alert-success";
                $scope.messageModal = response.message;
                $timeout(function(argument) {

                    $scope.showmessageModal = false;
                    $('#myModal').modal('hide');
                    $scope.loadGroups();

                }, 2000)


            } else {
                $scope.showmessage = true;
                $scope.alettype = "alert alert-danger";
                $scope.message = response.message;

                $timeout(function(argument) {

                    $scope.showmessageModal = false;
                    $scope.loadGroups();

                }, 3000)


            }
        })

    }
    $scope.loadGroups = function() {
        var input = {
            shop_id: $localStorage.id
        };
        groupService.fetchGroups(input, function(response) {
            if (response.messageId == 200) {
                if (response.data.length < 1) {
                    $scope.showmessage = true;
                    $scope.alerttype = "alert alert-warning"
                    $scope.message = "Oops, sorry no group data found";
                } else {

                    console.log("data fetched:", response.data);
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
                    $scope.showmessage = false;
                    $scope.showmessage = true;
                    $scope.alerttype = "alert alert-info"
                    $scope.message = "You currently have " + response.data.length + " groups in stores."
                    $scope.storeGroup = response.data;
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
    }
    $scope.deleteGroup = function(value) {
        $confirm({
                text: 'Are you sure you want to delete group?'
            })
            .then(function() {
                var input = {
                    _id: value,
                    shop_id: $localStorage.id

                };
                groupService.deletGroup(input, function(response) {
                    if (response.messageId == 200) {

                        $scope.showmessage = true;
                        $scope.alerttype = "alert alert-success"
                        $scope.message = response.message;
                        $timeout(function(argument) {

                            $scope.showmessage = false;
                            $scope.loadGroups();
                        }, 2000)

                    } else {
                        $scope.showmessage = true;
                        $scope.alerttype = "alert alert-warning"
                        $scope.message = response.message;
                        $timeout(function(argument) {

                            $scope.showmessage = false;
                             $scope.loadGroups();
                        }, 2000)

                    }
                })
            });



    }
    $scope.edit = function(value) {
        $scope.edit_id = value._id;
        $scope.store = value;
    }
}]);
