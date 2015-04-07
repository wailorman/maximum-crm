angular.module( 'starter.coaches', [] )
    .config( function ( $stateProvider ) {

        $stateProvider
            //.state( 'app.coaches.view', {
            //    url: "/coaches/:id",
            //    resolve: {
            //        additionalStateParams: function () {
            //            return {
            //                listType: 'coaches'
            //            };
            //        }
            //    },
            //    views: {
            //        'menuContent': {
            //            templateUrl: "templates/coaches/coaches-view.html",
            //            controller: 'ViewCtrl'
            //        }
            //    }
            //} )
            .state( 'coaches', {
                url: '/coaches',
                abstract: true,
                templateUrl: "templates/menu.html"
            } )
            .state( 'coaches.list', {
                url: '',
                resolve: {
                    additionalStateParams: function () {
                        return {
                            listType: 'coaches'
                        };
                    }
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/coaches/coaches-list.html",
                        controller: 'ListCtrl'
                    }
                }
            } )
            .state( 'coaches.view', {
                url: "/:id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/coaches/coaches-view.html",
                        controller: 'ViewCtrl'
                    }
                },
                resolve: {
                    additionalStateParams: function () {
                        return {
                            viewType: 'coach'
                        };
                    }
                },
            } );

    } );