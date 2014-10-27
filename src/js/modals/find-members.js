'use strict';

function openFindMembersModal($modal, multiplie, callback, arrayToPush) {
    return function () {
        var modalInstance = $modal.open({
            templateUrl: '/views/modules/modals/find-members.html',
            controller: 'FindMembersModalCtrl',
            resolve: {
                multiplie: function () {
                    return multiplie;
                }
            }
        });
        modalInstance.result.then(function (newMembers) {

            if (newMembers){
                if (arrayToPush !== undefined && arrayToPush !== null) {

                    if (multiplie === true) {
                        for (var i = 0; newMembers[i]; i++) {
                            if (!isObjectAlreadyExistsInArray(newMembers[i], arrayToPush)) {
                                arrayToPush.push(newMembers[i]);
                            }
                        }
                    } else {
                        arrayToPush = newMembers[0];
                    }


                } else {
                    callback(newMembers);
                }
            }


            //

            //


        });
    };
}


function FindMembersModalCtrl($scope, $rootScope, $modal, $http, $modalInstance, multiplie) {
    $http.get('/backend/members.json')
        .success(function (data) {
            $scope.members = data;
        });

    $scope.searchStr = '';

    // ЛИМИТЫ

    var limitStep = 20; // шаг подгрузки строк
    $scope.showLimit = 20; // лимит отображаемых строк
    $scope.incrementLimit = function () { // подгрузить еще строк
        $scope.showLimit += limitStep;
    };


    // ВЫДЕЛЕНИЕ

    $scope.selectMember = function (number) {
        if (multiplie === true) {
            if ($scope.members[number].selected !== true) {
                $scope.members[number].selected = true;
            } else {
                $scope.members[number].selected = false;
            }
        } else {
            for (var i = 0; $scope.members[i] !== undefined; i++) {
                $scope.members[i].selected = false;
            }

            $scope.members[number].selected = true;
        }
    };

    $scope.ok = function () {
        var newMembers = [];
        for (var i = 0; $scope.members[i] !== undefined; i++) {
            if ($scope.members[i].selected === true) {
                delete $scope.members[i].selected; // убираем парамер selected, чтобы он не уходил в бекенд
                newMembers.push($scope.members[i]);
            }
        }

        $modalInstance.close(newMembers);
    };
    $scope.cancel = function () {
        $modalInstance.close();
    };

}

angular.module('maximumCrm')
    .controller('FindMembersModalCtrl', ['$scope', '$rootScope', '$modal', '$http', '$modalInstance', 'multiplie',
        FindMembersModalCtrl()]);