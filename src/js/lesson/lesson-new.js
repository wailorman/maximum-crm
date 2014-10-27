angular.module('maximumCrm')
    .controller('NewLessonCtrl', ['$scope', '$rootScope', '$http',
        function ($scope, $rootScope, $http) {

            $rootScope.curPageName = 'Создание занятия';

            $scope.lessonInfo = {
                lessonID: "abd9789abd9adb789abc978dc567",
                group: [{
                    name: 'Дети-12',
                    ID: "abd9789abd9adb789abc978dc567"
                }],
                coach: [{
                    name: 'Пупкин В.И.',
                    ID: 'abd9789abd9adb789abc978dc567'
                }],
                hall: [{
                    name: "Ирландский зал",
                    ID: "abd9789abd9adb789abc978dc567"
                }],
                time: {
                    date: "24.01.2015",
                    startTime: "15:00",
                    endTime: "17:00"
                }
            };

            /*$scope.tags = [
             {"name": "Тучков"},
             {"name": "Попов"}
             ];*/

            $scope.coachesModel = $scope.lessonInfo.coach;
            $scope.hallsModel = $scope.lessonInfo.hall;
            $scope.groupsModel = $scope.lessonInfo.group;

            $scope.loadTags = function (query) {
                return $http.get('/backend/coaches.json');
            };
        }]);