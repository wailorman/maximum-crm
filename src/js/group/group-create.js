function GroupCreateCtrl($scope, $rootScope, $http, $modal) {


    $scope.newGroup = {
        name: null,
        periodicity: [],
        members: [],
        cost: null,
        type: null
    };

    $scope.clearModel = function () {
        $scope.newGroup = {
            name: null,
            periodicity: [],
            members: [],
            cost: null,
            type: null
        };
    };

    $scope.periodicityOpen = true;
    $scope.membersOpen = true;
    $scope.collapsePeriodicity = function () {
        $scope.periodicityOpen = !$scope.periodicityOpen;
    };
    $scope.collapseMembers = function () {
        $scope.membersOpen = !$scope.membersOpen;
    };

    $scope.removePeriodicity = function (id) {
        openAcceptDeletingModal($modal, function () {
            $scope.groupInfo.periodicity.splice(id,1);
        });
    };
    $scope.removeMember = function (id) {
        openAcceptDeletingModal($modal, function () {
            $scope.groupInfo.members.splice(id,1);
        });
    };

    $scope.openCreatePeriodicityModal = openCreatePeriodicityModal($modal, null, $scope.newGroup.periodicity);
    $scope.openFindMembersModal = openFindMembersModal($modal, null, $scope.newGroup.members);


}

angular.module('maximumCrm')
    .controller('GroupCreateCtrl', ['$scope', '$rootScope', '$http', '$modal',
        GroupCreateCtrl()]);