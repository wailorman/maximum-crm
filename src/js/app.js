'use strict';

function isObjectAlreadyExistsInArray(obj, array) {
    // Ищет по id

    var curArray; // current array for while

    if ( array.length > 0 ){
        for (var i = 0; array[i] !== undefined; i++) {
            curArray = array[i];

            if (obj.id === curArray.id) {
                return true;
            }
        }
    }else{
        return false;
    }
}

var crm = angular.module('maximumCrm', [
    'ngRoute',
    'ngTagsInput',
    'ui.bootstrap'

    //'maximumCrm.feed'

//    'maximumCrm.lessonInfo',
//    'maximumCrm.editLesson',
//    'maximumCrm.newLesson',
//    'maximumCrm.lessonsList'

])

    // Router

    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider

            .when('/feed', {
                templateUrl: '/views/modules/feed.html',
                controller: 'FeedCtrl'
            })

            // LESSON

            .when('/lessonInfo', {
                templateUrl: '/views/modules/lesson/lesson-info.html',
                controller: 'LessonInfoCtrl'
            })
            .when('/lessonEdit', {
                templateUrl: '/views/modules/lesson/lesson-edit.html',
                controller: 'EditLessonCtrl'
            })
            .when('/lessonNew', {
                templateUrl: '/views/modules/lesson/lesson-new.html',
                controller: 'NewLessonCtrl'
            })
            .when('/lessonsList', {
                templateUrl: '/views/modules/lesson/lessons-list.html',
                controller: 'LessonsListCtrl'
            })

            // GROUP

            .when('/groupInfo', {
                templateUrl: '/views/modules/group/group-info.html',
                controller: 'GroupInfoCtrl'
            })
            .when('/groupEdit', {
                templateUrl: '/views/modules/group/group-edit.html',
                controller: 'GroupEditCtrl'
            })
            .when('/groupCreate', {
                templateUrl: '/views/modules/group/group-create.html',
                controller: 'GroupCreateCtrl'
            })
            .when('/groupsList', {
                templateUrl: '/views/modules/group/groups-list.html',
                controller: 'GroupsListCtrl'
            });
    }])


    .controller("NavigationCtrl", [
        '$rootScope',
        '$scope',
        '$window',
        '$routeParams',
        '$route',
        '$location',

        function ($rootScope, $scope, $window, $routeParams, $route, $location) {


            var NavigationCtrl = this;
            $scope.window = {width: $window.innerWidth, height: $window.innerHeight};
            $scope.isMobile = ($scope.window.width < 768) ? true : false;

            $rootScope.appName = 'Maximum CRM';
            $rootScope.user = {name: 'wailorman'};

            $rootScope.modules = [
                {
                    desc: 'Лента',
                    href: '/feed'
                },
                {
                    desc: 'Информация о занятии',
                    href: '/lessonInfo'
                },
                {
                    desc: 'Изменение занятия',
                    href: '/lessonEdit'
                },
                {
                    desc: 'Создание занятия',
                    href: '/lessonNew'
                },
                {
                    desc: 'Список занятий',
                    href: '/lessonsList'
                },
                {
                    desc: 'Информация о группе',
                    href: '/groupInfo'
                },
                {
                    desc: 'Изменение группы',
                    href: '/groupEdit'
                },
                {
                    desc: 'Создание группы',
                    href: '/groupCreate'
                },
                {
                    desc: 'Список групп',
                    href: '/groupsList'
                }
            ];

            // скрытие sidebar
            $scope.getHideSideBarButtonClass = function () {
                return $scope.hideSideBar ? 'fa-arrow-right' : 'fa-arrow-left';
            };


            $scope.toggleHideSideBar = function () {
                $scope.hideSideBar = $scope.hideSideBar ? false : true;
            };

            $rootScope.href = function(href){
                $location.path( href );
            };



        }]);