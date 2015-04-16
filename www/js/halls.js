angular.module( 'starter.halls', [] )
    .config( function ( $stateProvider ) {

        $stateProvider
            .state( 'app.halls', {
                url: '/halls',
                parent: 'app',
                views: {
                    'menuContent@app': {
                        templateUrl: "templates/halls/halls-list.html",
                        controller: 'ListCtrl'
                    }
                },
                resolve: {
                    additionalStateParams: function () {
                        return {
                            resourceType: 'Halls'
                        };
                    }
                }
            } )
            .state( 'app.halls.create', {
                url: "/new",
                parent: 'app.halls',
                views: {
                    'menuContent@app': {
                        templateUrl: "templates/halls/halls-create.html",
                        controller: 'CreateCtrl'
                    }
                },
                resolve: {
                    additionalStateParams: function () {
                        return {
                            resourceType: 'Halls'
                        };
                    }
                }
            } )
            .state( 'app.halls.view', {
                url: "/{id}",
                parent: 'app.halls',
                views: {
                    'menuContent@app': {
                        templateUrl: "templates/halls/halls-view.html",
                        controller: 'ViewCtrl'
                    }
                },
                resolve: {
                    additionalStateParams: function () {
                        return {
                            resourceType: 'Halls'
                        };
                    }
                }
            } )
            .state( 'app.halls.edit', {
                url: "/{id}/edit",
                parent: 'app.halls',
                views: {
                    'menuContent@app': {
                        templateUrl: "templates/halls/halls-edit.html",
                        controller: 'EditCtrl'
                    }
                },
                resolve: {
                    additionalStateParams: function () {
                        return {
                            resourceType: 'Halls'
                        };
                    }
                }
            } );

    } );