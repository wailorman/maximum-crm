function LessonsListCtrl($scope, $rootScope, $http) {

    $rootScope.curPageName = 'Список занятий';

    $scope.lessons = [
        {
            ID: '5r9308ygufphvj89p23qho8j4p9f',
            checked: false,
            group: {
                ID: '5r9308ygufphvj89p23qho8j4p9f',
                name: 'Дети-12'
            },
            coaches: [
                {
                    ID: '5r9308ygufphvj89p23qho8j4p9f',
                    name: 'Пупкин Василий Викторович'
                }
            ],
            hall: {
                ID: '5r9308ygufphvj89p23qho8j4p9f',
                name: 'Ирландский зал'
            },
            time: {
                date: '26.01.2015',
                startTime: '16:00',
                endTime: '17:00'
            }
        },
        {
            ID: '5r9308ygufphvj89p23qho8j4p9f',
            checked: false,
            group: {
                ID: '5r9308ygufphvj89p23qho8j4p9f',
                name: 'Дети-12'
            },
            coaches: [
                {
                    ID: '5r9308ygufphvj89p23qho8j4p9f',
                    name: 'Пупкин Василий Викторович'
                },
                {
                    ID: '5r9308ygufphvj89p23qho8j4p9f',
                    name: 'Иванов Иван Иванович'
                }
            ],
            hall: {
                ID: '5r9308ygufphvj89p23qho8j4p9f',
                name: 'Ирландский зал'
            },
            time: {
                date: '26.01.2015',
                startTime: '16:00',
                endTime: '17:00'
            }
        },
        {
            ID: '5r9308ygufphvj89p23qho8j4p9f',
            checked: false,
            group: {
                ID: '5r9308ygufphvj89p23qho8j4p9f',
                name: 'Дети-12'
            },
            coaches: [
                {
                    ID: '5r9308ygufphvj89p23qho8j4p9f',
                    name: 'Пупкин Василий Викторович'
                }
            ],
            hall: {
                ID: '5r9308ygufphvj89p23qho8j4p9f',
                name: 'Ирландский зал'
            },
            time: {
                date: '26.01.2015',
                startTime: '16:00',
                endTime: '17:00'
            }
        }
    ];

    $scope.checkAll = false;
    $scope.toggleCheckAll = function () {
        if ($scope.checkAll === false) {
            for (var i = 0; $scope.lessons[i]; i++) {
                $scope.lessons[i].checked = true;
                $scope.checkAll = true;
            }
        } else {
            for (var k = 0; $scope.lessons[k]; k++) {
                $scope.lessons[k].checked = false;
                $scope.checkAll = false;
            }
        }
    };
}

angular.module('maximumCrm')
    .controller('LessonsListCtrl', ['$scope', '$rootScope', '$http',
        LessonsListCtrl()]);