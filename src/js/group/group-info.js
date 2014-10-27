angular.module('maximumCrm')
    .controller('GroupInfoCtrl', ['$scope', '$rootScope',
        function ($scope, $rootScope) {

            $rootScope.curPageName = 'Информация о группе';

            $scope.groupInfo = {
                id: "abd9789abd9adb789abc978dc567",
                name: "Детишки-12",
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
            };
            $scope.coaches = [];

            var per = $scope.groupInfo.periodicity;
            for (var i = 0; per[i] !== undefined; i++) {
                if (!isObjectAlreadyExistsInArray(per[i].coach, $scope.coaches)) {
                    $scope.coaches.push(per[i].coach);
                }
            }

            $scope.periodicityOpen = true;
            $scope.membersOpen = true;

            $scope.collapsePeriodicity = function () {
                $scope.periodicityOpen = !$scope.periodicityOpen;
            };

            $scope.collapseMembers = function () {
                $scope.membersOpen = !$scope.membersOpen;
            };
        }]);