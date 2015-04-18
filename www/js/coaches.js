angular.module( 'starter.coaches', [] )
    .config( function ( $stateProvider ) {

        $stateProvider
            .state( 'app.coaches', {
                url: '/coaches',
                parent: 'app',
                views: {
                    'menuContent@app': {
                        templateUrl: "templates/coaches/coaches-list.html",
                        controller: 'ListCtrl'
                    }
                },
                resolve: {
                    additionalStateParams: function () {
                        return {
                            resourceType: 'Coaches'
                        };
                    }
                }
            } )
            .state( 'app.coaches.create', {
                url: "/new",
                parent: 'app.coaches',
                views: {
                    'menuContent@app': {
                        templateUrl: "templates/coaches/coaches-create.html",
                        controller: 'CreateCtrl'
                    }
                },
                resolve: {
                    additionalStateParams: function () {
                        return {
                            resourceType: 'Coaches'
                        };
                    }
                }
            } )
            .state( 'app.coaches.view', {
                url: "/{id}",
                parent: 'app.coaches',
                views: {
                    'menuContent@app': {
                        templateUrl: "templates/coaches/coaches-view.html",
                        controller: 'ViewCtrl'
                    }
                },
                resolve: {
                    additionalStateParams: function () {
                        return {
                            resourceType: 'Coaches'
                        };
                    }
                }
            } )
            .state( 'app.coaches.edit', {
                url: "/{id}/edit",
                parent: 'app.coaches',
                views: {
                    'menuContent@app': {
                        templateUrl: "templates/coaches/coaches-edit.html",
                        controller: 'EditCtrl'
                    }
                },
                resolve: {
                    additionalStateParams: function () {
                        return {
                            resourceType: 'Coaches'
                        };
                    }
                }
            } );

    } );