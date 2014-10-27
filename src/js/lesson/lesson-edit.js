angular.module('maximumCrm')
    .controller('EditLessonCtrl', ['$scope', '$rootScope', '$http',
        function EditLessonCtrl($scope, $rootScope, $http) {

            $rootScope.curPageName = 'Изменение занятия';

            $scope.lessonInfo = {
                lessonID: "abd9789abd9adb789abc978dc567",
                group: [
                    {
                        name: 'Дети-12',
                        ID: "abd9789abd9adb789abc978dc567"
                    }
                ],
                coach: [
                    {
                        name: 'Пупкин В.И.',
                        ID: 'abd9789abd9adb789abc978dc567'
                    },
                    {
                        name: 'Иванов В.В.',
                        ID: 'abd9789abd9adb789abc978dc567'
                    }
                ],
                hall: [
                    {
                        name: "Ирландский зал",
                        ID: "abd9789abd9adb789abc978dc567"
                    }
                ],
                time: {
                    //TODO Ангуляр плюётся на Date. Требует Date object
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

            $scope.hideDel = function(){
                $scope.showDel = false;
            };
            $scope.showDel = true;
        }]);