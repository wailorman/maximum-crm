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
                templateUrl: 'views/feed/feed.html',
                controller: 'FeedCtrl'
            })

            // LESSON

            .when('/lessonInfo', {
                templateUrl: 'views/lesson/lesson-info.html',
                controller: 'LessonInfoCtrl'
            })
            .when('/lessonEdit', {
                templateUrl: 'views/lesson/lesson-edit.html',
                controller: 'EditLessonCtrl'
            })
            .when('/lessonCreate', {
                templateUrl: 'views/lesson/lesson-create.html',
                controller: 'LessonCreateCtrl'
            })
            .when('/lessonsList', {
                templateUrl: 'views/lesson/lessons-list.html',
                controller: 'LessonsListCtrl'
            })

            // GROUP

            .when('/groupInfo', {
                templateUrl: 'views/group/group-info.html',
                controller: 'GroupInfoCtrl'
            })
            .when('/groupEdit', {
                templateUrl: 'views/group/group-edit.html',
                controller: 'GroupEditCtrl'
            })
            .when('/groupCreate', {
                templateUrl: 'views/group/group-create.html',
                controller: 'GroupCreateCtrl'
            })
            .when('/groupsList', {
                templateUrl: 'views/group/groups-list.html',
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
                    desc: 'Занятия',
                    href: '/lessonsList',
                    nextLevel: [
                        {
                            desc: 'Список занятий',
                            href: '/lessonsList'
                        },
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
                            href: '/lessonCreate'
                        }
                    ]
                },
                {
                    desc: 'Группы',
                    nextLevel: [
                        {
                            desc: 'Список групп',
                            href: '/groupsList'
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
                        }
                    ]
                }
            ];

            $rootScope.secondLevelMenuVisible = function ( module ) {
                return (module.nextLevel !== undefined);
            };

            // скрытие sidebar
            $scope.getHideSideBarButtonClass = function () {
                return $scope.hideSideBar ? 'fa-arrow-right' : 'fa-arrow-left';
            };

            $scope.sidebarVisible = true;


            $scope.toggleVisibleSideBar = function () {
                $scope.sidebarVisible = !$scope.sidebarVisible;
            };

            $rootScope.href = function(href){
                $location.path( href );
            };



        }]);