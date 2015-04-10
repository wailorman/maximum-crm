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
                            createType: 'client'
                        };
                    }
                }
            } )
            .state( 'clients.list', {
                url: '',
                resolve: {
                    additionalStateParams: function () {
                        return {
                            listType: 'clients'
                        };
                    }
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/clients/clients-list.html",
                        controller: 'ListCtrl'
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
                            viewType: 'client'
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
                            editType: 'client'
                        };
                    }
                }
            } );

    } );