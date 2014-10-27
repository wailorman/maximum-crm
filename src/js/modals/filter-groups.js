'use strict';

function openFilterGroupModal($modal, callback, arrayToPush) {
    return function () {
        var modalInstance = $modal.open({
            templateUrl: '/views/modules/modals/filter-groups.html',
            controller: 'FilterGroupsModalCtrl'
        });
        /*modalInstance.result.then(function (newCoaches) {
            if (arrayToPush !== undefined && arrayToPush !== null) {

                if (multiplie === true) {
                    for (var i = 0; newCoaches[i]; i++) {
                        if (!isObjectAlreadyExistsInArray(newCoaches[i], arrayToPush)) {
                            arrayToPush.push(newCoaches[i]);
                        }
                    }
                } else {
                    arrayToPush = newCoaches[0];
                }


            } else {
                callback(newCoaches);
            }


        });*/
    };
}


function FilterGroupsModalCtrl($scope, $rootScope, $modal, $http, $modalInstance) {

    $scope.filterModel = {
        coaches: [],
        members: [],
        halls: []
    };

    $scope.removeCoach = function (id) {
        $scope.filterModel.coaches.splice(id, 1);
    };
    $scope.removeMember = function (id) {
        $scope.filterModel.members.splice(id, 1);
    };
    $scope.removeHall = function (id) {
        $scope.filterModel.halls.splice(id, 1);
    };

    $scope.openFindCoachesModal = openFindCoachesModal($modal, true, null, $scope.filterModel.coaches);
    $scope.openFindMembersModal = openFindMembersModal($modal, true, null, $scope.filterModel.members);
    $scope.openFindHallsModal = openFindHallsModal($modal, true, null, $scope.filterModel.halls);

}

angular.module('maximumCrm')
    .controller('FilterGroupsModalCtrl', ['$scope', '$rootScope', '$modal', '$http', '$modalInstance',
        FilterGroupsModalCtrl()]);