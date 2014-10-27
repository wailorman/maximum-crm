function LessonInfoCtrl($scope, $rootScope) {

    $rootScope.curPageName = 'Информация о занятии';

    $scope.lessonInfo = {
        id: "abd9789abd9adb789abc978dc567",
        group: {
            name: 'Дети-12',
            id: "abd9789abd9adb789abc978dc567"
        },
        coach: {
            name: 'Пупкин Василий Иванович',
            id: 'abd9789abd9adb789abc978dc567'
        },
        hall: {
            name: "Ирландский зал",
            id: "abd9789abd9adb789abc978dc567"
        },
        time: {
            date: "24.01.2015",
            start: "15:00",
            end: "17:00"
        }
    };

}

//angular.module('maximumCrm')
crm.controller('LessonInfoCtrl', ['$scope', '$rootScope', LessonInfoCtrl()]);