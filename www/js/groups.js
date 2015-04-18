angular.module( 'starter.groups', [] )
    .config( function ( $stateProvider ) {

        $stateProvider
            .state( 'app.groups', {
                url: '/groups',
                parent: 'app',
                views: {
                    'menuContent@app': {
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
            .state( 'app.groups.create', {
                url: "/new",
                parent: 'app.groups',
                views: {
                    'menuContent@app': {
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
            .state( 'app.groups.view', {
                url: "/{id}",
                parent: 'app.groups',
                views: {
                    'menuContent@app': {
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
            .state( 'app.groups.edit', {
                url: "/{id}/edit",
                parent: 'app.groups',
                views: {
                    'menuContent@app': {
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