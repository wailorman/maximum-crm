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
                            createType: 'group'
                        };
                    }
                }
            } )
            .state( 'groups.list', {
                url: '',
                resolve: {
                    additionalStateParams: function () {
                        return {
                            listType: 'groups'
                        };
                    }
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/groups/groups-list.html",
                        controller: 'ListCtrl'
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
                            viewType: 'group'
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
                            editType: 'group'
                        };
                    }
                }
            } );

    } );