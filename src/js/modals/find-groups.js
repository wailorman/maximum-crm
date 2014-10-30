function openFindGroupsModal($modal, multiplie, callback, arrayToPush) {
    return function () {
        var modalInstance = $modal.open({
            templateUrl: 'views/modals/find-groups.html',
            controller: 'FindGroupsModalCtrl',
            resolve: {
                multiplie: function () {
                    return multiplie;
                }
            }
        });
        modalInstance.result.then(function (newGroups) {
            if ( newGroups ){
                if (arrayToPush !== undefined && arrayToPush !== null) {

                    if (multiplie === true) {
                        for (var i = 0; newGroups[i]; i++) {
                            if (!isObjectAlreadyExistsInArray(newGroups[i], arrayToPush)) {
                                arrayToPush.push(newGroups[i]);
                            }
                        }
                    } else {
                        arrayToPush = newGroups[0];
                    }


                } else {
                    callback(newGroups);
                }
            }

        });
    };
}




angular.module('maximumCrm')
    .controller('FindGroupsModalCtrl', ['$scope', '$rootScope', '$modal', '$http', '$modalInstance', 'multiplie',
        function ($scope, $rootScope, $modal, $http, $modalInstance, multiplie) {

            $http.get('/backend/groups.json')
                .success(function (data) {
                    $scope.groups = data;
                });


            $scope.searchStr = '';


            // ЛИМИТЫ

            var limitStep = 20; // шаг подгрузки строк
            $scope.showLimit = 30; // лимит отображаемых строк
            $scope.incrementLimit = function () { // подгрузить еще строк
                $scope.showLimit += limitStep;
            };


            // ВЫДЕЛЕНИЕ

            $scope.selectGroup = function (number) {
                if (multiplie === true) {
                    if ($scope.groups[number].selected !== true) {
                        $scope.groups[number].selected = true;
                    } else {
                        $scope.groups[number].selected = false;
                    }
                } else {
                    for (var i = 0; $scope.groups[i] !== undefined; i++) {
                        $scope.groups[i].selected = false;
                    }

                    $scope.groups[number].selected = true;
                }
            };

            $scope.ok = function () {
                var newGroups = [];
                for (var i = 0; $scope.groups[i] !== undefined; i++) {
                    if ($scope.groups[i].selected === true) {
                        delete $scope.groups[i].selected; // убираем парамер selected, чтобы он не уходил в бекенд
                        newGroups.push($scope.groups[i]);
                    }
                }

                $modalInstance.close(newGroups);
            };
            $scope.cancel = function () {
                $modalInstance.close();
            };
        }]);