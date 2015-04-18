angular.module( 'starter.clients', [] )
    .config( function ( $stateProvider ) {

        $stateProvider
            .state( 'app.clients', {
                url: '/clients',
                parent: 'app',
                views: {
                    'menuContent@app': {
                        templateUrl: "templates/clients/clients-list.html",
                        controller: 'ListCtrl'
                    }
                },
                resolve: {
                    additionalStateParams: function () {
                        return {
                            resourceType: 'Clients'
                        };
                    }
                }
            } )
            .state( 'app.clients.create', {
                url: "/new",
                parent: 'app.clients',
                views: {
                    'menuContent@app': {
                        templateUrl: "templates/clients/clients-create.html",
                        controller: 'CreateCtrl'
                    }
                },
                resolve: {
                    additionalStateParams: function () {
                        return {
                            resourceType: 'Clients'
                        };
                    }
                }
            } )
            .state( 'app.clients.view', {
                url: "/{id}",
                parent: 'app.clients',
                views: {
                    'menuContent@app': {
                        templateUrl: "templates/clients/clients-view.html",
                        controller: 'ViewCtrl'
                    }
                },
                resolve: {
                    additionalStateParams: function () {
                        return {
                            resourceType: 'Clients'
                        };
                    }
                }
            } )
            .state( 'app.clients.edit', {
                url: "/{id}/edit",
                parent: 'app.clients',
                views: {
                    'menuContent@app': {
                        templateUrl: "templates/clients/clients-edit.html",
                        controller: 'EditCtrl'
                    }
                },
                resolve: {
                    additionalStateParams: function () {
                        return {
                            resourceType: 'Clients'
                        };
                    }
                }
            } );

    } );