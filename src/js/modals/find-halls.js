'use strict';

function openFindHallsModal($modal, multiplie, callback, arrayToPush) {
    return function () {
        var modalInstance = $modal.open({
            templateUrl: '/views/modules/modals/find-halls.html',
            controller: 'FindHallsModalCtrl',
            resolve: {
                multiplie: function () {
                    return multiplie;
                }
            }
        });
        modalInstance.result.then(function (newHalls) {

            if (newHalls){
                if (arrayToPush !== undefined && arrayToPush !== null) {

                    if (multiplie === true) {
                        for (var i = 0; newHalls[i]; i++) {
                            if (!isObjectAlreadyExistsInArray(newHalls[i], arrayToPush)) {
                                arrayToPush.push(newHalls[i]);
                            }
                        }
                    } else {
                        arrayToPush = newHalls[0];
                    }


                } else {
                    callback(newHalls);
                }
            }

        });
    };
}


function FindHallsModalCtrl($scope, $rootScope, $modal, $http, $modalInstance, multiplie) {
    $http.get('/backend/halls.json')
        .success(function (data) {
            $scope.halls = data;
        });

    $scope.searchStr = '';

    // ЛИМИТЫ

    var limitStep = 20; // шаг подгрузки строк
    $scope.showLimit = 20; // лимит отображаемых строк
    $scope.incrementLimit = function () { // подгрузить еще строк
        $scope.showLimit += limitStep;
    };

    // -----

    $scope.selectHall = function (number) {
        if (multiplie === true) {
            if ($scope.halls[number].selected !== true) {
                $scope.halls[number].selected = true;
            } else {
                $scope.halls[number].selected = false;
            }
        } else {
            for (var i = 0; $scope.halls[i] !== undefined; i++) {
                $scope.halls[i].selected = false;
            }

            $scope.halls[number].selected = true;
        }
    };


    $scope.ok = function () {
        var newHalls = [];
        for (var i = 0; $scope.halls[i] !== undefined; i++) {
            if ($scope.halls[i].selected === true) {
                delete $scope.halls[i].selected; // убираем парамер selected, чтобы он не уходил в бекенд
                newHalls.push($scope.halls[i]);
            }
        }

        $modalInstance.close(newHalls);
    };

    $scope.cancel = function () {
        $modalInstance.close();
    };
}

angular.module('maximumCrm')
    .controller('FindHallsModalCtrl', ['$scope', '$rootScope', '$modal', '$http', '$modalInstance', 'multiplie',
        FindHallsModalCtrl()]);