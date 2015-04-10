angular.module( 'starter.groups', [] )
    .config( function ( $stateProvider ) {

        $stateProvider
            .state( 'groups', {
                url: '/groups',
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            } )
            .state( 'groups.create', {
                url: "/new",
                views: {
                    'menuContent': {
                        templateUrl: "templates/groups/groups-create.html",
                        controller: 'CreateCtrl'
                    }
                },
                resolve: {
                    additionalStateParams: function () {
                        return {
                            resourceType: 'Groups'
                        };
                    }
                }
            } )
            .state( 'groups.list', {
                url: '',
                views: {
                    'menuContent': {
                        templateUrl: "templates/groups/groups-list.html",
                        controller: 'ListCtrl'
                    }
                },
                resolve: {
                    additionalStateParams: function () {
                        return {
                            resourceType: 'Groups'
                        };
                    }
                }
            } )
            .state( 'groups.view', {
                url: "/{id}",
                views: {
                    'menuContent': {
                        templateUrl: "templates/groups/groups-view.html",
                        controller: 'ViewCtrl'
                    }
                },
                resolve: {
                    additionalStateParams: function () {
                        return {
                            resourceType: 'Groups'
                        };
                    }
                }
            } )
            .state( 'groups.edit', {
                url: "/{id}/edit",
                views: {
                    'menuContent': {
                        templateUrl: "templates/groups/groups-edit.html",
                        controller: 'EditCtrl'
                    }
                },
                resolve: {
                    additionalStateParams: function () {
                        return {
                            resourceType: 'Groups'
                        };
                    }
                }
            } );

    } );