'use strict';

function openFindCoachesModal($modal, multiplie, callback, arrayToPush) {
    return function () {
        var modalInstance = $modal.open({
            templateUrl: '/views/modules/modals/find-coaches.html',
            controller: 'FindCoachesModalCtrl',
            resolve: {
                multiplie: function () {
                    return multiplie;
                }
            }
        });
        modalInstance.result.then(function (newCoaches) {
            if ( newCoaches ){
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
            }

        });
    };
}


function FindCoachesModalCtrl($scope, $rootScope, $modal, $http, $modalInstance, multiplie) {
    // Получаем список тренеров
    $http.get('/backend/coaches.json')
        .success(function (data) {
            $scope.coaches = data;
        });


    $scope.searchStr = '';


    // ЛИМИТЫ

    var limitStep = 20; // шаг подгрузки строк
    $scope.showLimit = 30; // лимит отображаемых строк
    $scope.incrementLimit = function () { // подгрузить еще строк
        $scope.showLimit += limitStep;
    };


    // ВЫДЕЛЕНИЕ

    $scope.selectCoach = function (number) {
        if (multiplie === true) {
            if ($scope.coaches[number].selected !== true) {
                $scope.coaches[number].selected = true;
            } else {
                $scope.coaches[number].selected = false;
            }
        } else {
            for (var i = 0; $scope.coaches[i] !== undefined; i++) {
                $scope.coaches[i].selected = false;
            }

            $scope.coaches[number].selected = true;
        }
    };

    $scope.ok = function () {
        var newCoaches = [];
        for (var i = 0; $scope.coaches[i] !== undefined; i++) {
            if ($scope.coaches[i].selected === true) {
                delete $scope.coaches[i].selected; // убираем парамер selected, чтобы он не уходил в бекенд
                newCoaches.push($scope.coaches[i]);
            }
        }

        $modalInstance.close(newCoaches);
    };
    $scope.cancel = function () {
        $modalInstance.close();
    };
}

angular.module('maximumCrm')
    .controller('FindCoachesModalCtrl', ['$scope', '$rootScope', '$modal', '$http', '$modalInstance', 'multiplie',
        FindCoachesModalCtrl()]);