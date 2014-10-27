angular.module('maximumCrm')
    .controller('GroupEditCtrl', ['$scope', '$rootScope', '$modal', '$http',
        function GroupEditCtrl($scope, $rootScope, $modal, $http) {
            $rootScope.curPageName = 'Изменение группы';

            $scope.groupInfo = {
                id: "abd9789abd9adb789abc978dc567",
                name: "Детишки-12",
                coaches: [
                    {id: "486sd648d648sdf64sd65", name: "Иванов И.И."}
                ],
                periodicity: [
                    {
                        dayOfTheWeek: 'ВТ',
                        time: {start: "15:00", end: "16:00"},
                        hall: {id: "sf864sdf486sfd468df465d", name: "Ирландский"},
                        coach: {id: "486sd648d648sdf64sd65", name: "Иванов И.И."}
                    },
                    {
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
                type: "Стандартная",
                cost: "1000"
            };

            /*$scope.$watchCollection($scope.groupInfo.periodicity, function () {
             for (var i = 0; $scope.groupInfo.periodicity[i] !== undefined; i++) {
             if (!isObjectAlreadyExistsInArray($scope.groupInfo.periodicity[i].coach, $scope.groupInfo.coaches)) {
             $scope.groupInfo.coaches.push($scope.groupInfo.periodicity[i].coach);
             }
             }
             });*/

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


            $scope.openCreatePeriodicityModal = openCreatePeriodicityModal($modal, function (newPeriodicity) {
                $scope.groupInfo.periodicity.push(newPeriodicity);
                if ( !isObjectAlreadyExistsInArray(newPeriodicity.coach, $scope.groupInfo.coaches) ){
                    $scope.groupInfo.coaches.push(newPeriodicity.coach);
                }
            });

            $scope.openFindMembersModal = openFindMembersModal($modal, true, null, $scope.groupInfo.members);


        }
    ]);

