angular.module( 'starter.clients', [] )
    .config( function ( $stateProvider ) {

        $stateProvider
            .state( 'clients', {
                url: '/clients',
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            } )
            .state( 'clients.create', {
                url: "/new",
                views: {
                    'menuContent': {
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
            .state( 'clients.list', {
                url: '',
                views: {
                    'menuContent': {
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
            .state( 'clients.view', {
                url: "/{id}",
                views: {
                    'menuContent': {
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
            .state( 'clients.edit', {
                url: "/{id}/edit",
                views: {
                    'menuContent': {
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