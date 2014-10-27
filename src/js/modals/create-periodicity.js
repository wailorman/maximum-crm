function openCreatePeriodicityModal($modal, callback, arrayToPush) {
    return function () {
        var modalInstance = $modal.open({
            templateUrl: '/views/modules/modals/create-periodicity.html',
            controller: 'CreatePeriodicityModalCtrl'
        });
        modalInstance.result.then(function (newPeriodicity) {
            if (arrayToPush !== undefined) {
                arrayToPush.push(newPeriodicity);
            } else {
                callback(newPeriodicity);
            }
        });
    };
}




angular.module('maximumCrm')
    .controller('CreatePeriodicityModalCtrl', ['$scope', '$rootScope', '$modal', '$http', '$modalInstance',
        function ($scope, $rootScope, $modal, $http, $modalInstance) {

            $scope.newPeriodicity = {
                dayOfTheWeek: "ПН",
                time: {
                    start: "",
                    end: ""
                },
                hall: null,
                coach: null
            };

            $scope.openFindCoachesModal = openFindCoachesModal($modal, false, function (newCoaches) {
                $scope.newPeriodicity.coach = newCoaches[0];
            });

            $scope.openFindHallsModal = openFindHallsModal($modal, false, function (newHalls) {
                $scope.newPeriodicity.hall = newHalls[0];
            });


            $scope.removeHall = function (id) {
                $scope.newPeriodicity.hall = null;
//        removeById(id, $scope.newPeriodicity.hall);
            };
            $scope.removeCoach = function (id) {
                $scope.newPeriodicity.coach = null;
//        removeById(id, $scope.newPeriodicity.coach);
            };

            $scope.ok = function () {
                $modalInstance.close($scope.newPeriodicity);
            };
            $scope.cancel = function () {
                $modalInstance.close();
            };
        }]);