/**
 * Created by wailorman on 15.09.2014.
 */
angular.module('maximumCrm')
    .controller('FeedCtrl', [
        '$scope',
        '$rootScope',
        '$routeParams',
        '$location',

        function ($scope, $rootScope, $routeParams, $location) {

            $rootScope.curPageName = 'Лента';

            $scope.lessons = [
                { sectionID: '4564', active: false, startTime: '15:00', endTime: '16:30', hallName: 'Ирландский зал' },
                { sectionID: '5646', active: false, startTime: '15:00', endTime: '16:30', hallName: 'Ирландский зал' },
                { sectionID: '325', active: false, startTime: '15:00', endTime: '16:30', hallName: 'Ирландский зал' },
                { sectionID: '8', active: true, startTime: '15:00', endTime: '16:30', hallName: 'Ирландский зал' },
                { sectionID: '568', active: false, startTime: '15:00', endTime: '16:30', hallName: 'Ирландский зал' },
                { sectionID: '68456', active: false, startTime: '15:00', endTime: '16:30', hallName: 'Ирландский зал' },
                { sectionID: '54', active: false, startTime: '15:00', endTime: '16:30', hallName: 'Ирландский зал' }
            ];


            $scope.getClass = function (iterator) {
                if ($scope.lessons[iterator].active === true) {
                    return 'active';
                }
                if (iterator > 0 && $scope.lessons[iterator - 1].active === true) {
                    return 'next';
                }
            };

            $scope.logg = function () {
                console.log($location.path());
            };
        }]);