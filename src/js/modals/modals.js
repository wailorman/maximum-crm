'use strict';


function openAcceptDeletingModal($modal, callback) {
//    return function () {
    var modalInstance = $modal.open({
        templateUrl: '/views/modules/modals/accept-delete.html',
        controller: 'AcceptDeleteModalCtrl',
        size: 'sm'
    });

    modalInstance.result.then(function (isAccepted) {
        if (isAccepted === true) {
            callback();
        }
    });
//    };
}






angular.module('maximumCrm')
    .controller('AcceptDeleteModalCtrl', ['$scope', '$rootScope', '$modal', '$http', '$modalInstance',
        function ($scope, $rootScope, $modal, $http, $modalInstance) {


            $scope.ok = function () {
                $modalInstance.close(true);
            };
            $scope.cancel = function () {
                $modalInstance.close();
            };

        }]);


