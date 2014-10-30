function openFilterLessonsModal ($modal, callback, arrayToPush) {
    return function () {
        var modalInstance = $modal.open({
            templateUrl: 'views/modals/filter-lessons.html',
            controller: 'FilterLessonsModalCtrl'
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

angular.module('maximumCrm')
    .controller('FilterLessonsModalCtrl', [ '$scope', '$modalInstance', '$modal',
        function ($scope, $modalInstance, $modal) {
            $scope.filterModel = {
                groups: [],
                coaches: [],
                members: [],
                halls: [],
                date: {
                    from: null,
                    to: null
                }
            };

            $scope.removeGroup = function (id) {
                $scope.filterModel.groups.splice(id, 1);
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

            $scope.isDateRange = false; // диапазон дат

            $scope.openFindGroupsModal = openFindGroupsModal($modal, true, null, $scope.filterModel.groups);
            $scope.openFindCoachesModal = openFindCoachesModal($modal, true, null, $scope.filterModel.coaches);
            $scope.openFindMembersModal = openFindMembersModal($modal, true, null, $scope.filterModel.members);
            $scope.openFindHallsModal = openFindHallsModal($modal, true, null, $scope.filterModel.halls);
        }
    ]);