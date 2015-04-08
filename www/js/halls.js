angular.module( 'starter.halls', [] )
    .config( function ( $stateProvider ) {

        $stateProvider
            .state( 'halls', {
                url: '/halls',
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            } )
            .state( 'halls.create', {
                url: "/new",
                views: {
                    'menuContent': {
                        templateUrl: "templates/halls/halls-create.html",
                        controller: 'CreateCtrl'
                    }
                },
                resolve: {
                    additionalStateParams: function () {
                        return {
                            createType: 'hall'
                        };
                    }
                }
            } )
            .state( 'halls.list', {
                url: '',
                resolve: {
                    additionalStateParams: function () {
                        return {
                            listType: 'halls'
                        };
                    }
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/halls/halls-list.html",
                        controller: 'ListCtrl'
                    }
                }
            } )
            .state( 'halls.view', {
                url: "/{id}",
                views: {
                    'menuContent': {
                        templateUrl: "templates/halls/halls-view.html",
                        controller: 'ViewCtrl'
                    }
                },
                resolve: {
                    additionalStateParams: function () {
                        return {
                            viewType: 'hall'
                        };
                    }
                }
            } )
            .state( 'halls.edit', {
                url: "/{id}/edit",
                views: {
                    'menuContent': {
                        templateUrl: "templates/halls/halls-edit.html",
                        controller: 'EditCtrl'
                    }
                },
                resolve: {
                    additionalStateParams: function () {
                        return {
                            editType: 'hall'
                        };
                    }
                }
            } );

    } );