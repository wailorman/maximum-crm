angular.module( 'starter.coaches', [] )
    .config( function ( $stateProvider ) {

        $stateProvider
            .state( 'coaches', {
                url: '/coaches',
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            } )
            .state( 'coaches.create', {
                url: "/new",
                views: {
                    'menuContent': {
                        templateUrl: "templates/coaches/coaches-create.html",
                        controller: 'CreateCtrl'
                    }
                },
                resolve: {
                    additionalStateParams: function () {
                        return {
                            createType: 'coach'
                        };
                    }
                }
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
                url: "/{id}",
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
                }
            } )
            .state( 'coaches.edit', {
                url: "/{id}/edit",
                views: {
                    'menuContent': {
                        templateUrl: "templates/coaches/coaches-edit.html",
                        controller: 'EditCtrl'
                    }
                },
                resolve: {
                    additionalStateParams: function () {
                        return {
                            editType: 'coach'
                        };
                    }
                }
            } );

    } );