'use strict';

function GroupsListCtrl($scope, $rootScope, $modal) {

    $rootScope.curPageName = 'Список групп';

    $scope.groups = [
        {
            id: "abd9789abd9adb789abc978dc567",
            name: "Детишки-12",
            coaches: [
                {id: "486sd648d648sdf64sd65", name: "Иванов И.И."}
            ],
            periodicity: [
                {
                    id: "sd48fas486df468asd68f",
                    dayOfTheWeek: 'ВТ',
                    time: {start: "15:00", end: "16:00"},
                    hall: {id: "sf864sdf486sfd468df465d", name: "Ирландский"},
                    coach: {id: "486sd648d648sdf64sd65", name: "Иванов И.И."}

                },
                {
                    id: "sd48fas486df468asd68f",
                    dayOfTheWeek: 'СР',
                    time: {start: "14:00", end: "16:00"},
                    hall: {id: "sf864sdf486sfd468df465d", name: "Ирландский"},
                    coach: {id: "486sd648d648sdf64sd65", name: "Иванов И.И."}

                }
            ],
            members: [
                {id: "sd456f64saf645sad654f", name: "Татауров Пахом"},
                {id: "sad4f64sdf654sad65f65", name: "Илюшина Анна"},
                {id: "sad4f64sdf65454563645", name: "Валиев Кирилл"},
                {id: "sav45s56s445454563645", name: "Букин Владислав"}
            ],
            type: 'Стандартная',
            cost: '1000'
        },
        {
            id: "abd975454555b789abc978dc568",
            name: "Детишки-16",
            coaches: [
                {id: "486sd648d648sdf64sd65", name: "Иванов И.И."}
            ],
            periodicity: [
                {
                    id: "sd48fas486df468asd68f",
                    dayOfTheWeek: 'ВТ',
                    time: {start: "15:00", end: "16:00"},
                    hall: {id: "sf864sdf486sfd468df465d", name: "Ирландский"},
                    coach: {id: "486sd648d648sdf64sd65", name: "Иванов И.И."}

                },
                {
                    id: "sd48fas486df468asd68f",
                    dayOfTheWeek: 'СР',
                    time: {start: "14:00", end: "16:00"},
                    hall: {id: "sf864sdf486sfd468df465d", name: "Ирландский"},
                    coach: {id: "486sd648d648sdf64sd65", name: "Иванов И.И."}

                }
            ],
            members: [
                {id: "sd456f64saf645sad654f", name: "Татауров Пахом"},
                {id: "sad4f64sdf654sad65f65", name: "Илюшина Анна"},
                {id: "sad4f64sdf65454563645", name: "Валиев Кирилл"},
                {id: "sav45s56s445454563645", name: "Букин Владислав"}
            ],
            type: 'Стандартная',
            cost: '1000'
        }
    ];

    $scope.checkAll = false;
    $scope.toggleCheckAll = function () {
        if ($scope.checkAll === false) {
            for (var i = 0; $scope.groups[i]; i++) {
                $scope.groups[i].checked = true;
                $scope.checkAll = true;
            }
        } else {
            for (var k = 0; $scope.groups[k]; k++) {
                $scope.groups[k].checked = false;
                $scope.checkAll = false;
            }
        }
    };

    $scope.isAnybodySelected = false;
    $scope.$watchCollection('groups', function () {
        for ( var i=0; $scope.groups[i] !== undefined; i++ ){
            if ( $scope.groups[i].checked === true ){
                $scope.isAnybodySelected = true;
            }
        }
    });

    $scope.openFilterGroupsModal = openFilterGroupModal($modal);

    $scope.filterModel = null;
}

angular.module('maximumCrm')
    .controller('GroupsListCtrl', ['$scope', '$rootScope', '$modal',
        GroupsListCtrl()]);