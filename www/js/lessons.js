angular.module( 'starter.lessons', [] )
    .config( function ( $stateProvider ) {

        $stateProvider
            .state( 'app.lessons', {
                url: '/lessons',
                parent: 'app',
                views: {
                    'menuContent@app': {
                        templateUrl: "templates/lessons/lessons-list.html",
                        controller: 'ListCtrl'
                    }
                },
                resolve: {
                    additionalStateParams: function () {
                        return {
                            resourceType: 'Lessons'
                        };
                    }
                }
            } )
            .state( 'app.lessons.create', {
                url: "/new",
                parent: 'app.lessons',
                views: {
                    'menuContent@app': {
                        templateUrl: "templates/lessons/lessons-create.html",
                        controller: 'CreateCtrl'
                    }
                },
                resolve: {
                    additionalStateParams: function () {
                        return {
                            resourceType: 'Lessons'
                        };
                    }
                }
            } )
            .state( 'app.lessons.view', {
                url: "/{id}",
                parent: 'app.lessons',
                views: {
                    'menuContent@app': {
                        templateUrl: "templates/lessons/lessons-view.html",
                        controller: 'ViewCtrl'
                    }
                },
                resolve: {
                    additionalStateParams: function () {
                        return {
                            resourceType: 'Lessons'
                        };
                    }
                }
            } )
            .state( 'app.lessons.edit', {
                url: "/{id}/edit",
                parent: 'app.lessons',
                views: {
                    'menuContent@app': {
                        templateUrl: "templates/lessons/lessons-edit.html",
                        controller: 'EditCtrl'
                    }
                },
                resolve: {
                    additionalStateParams: function () {
                        return {
                            resourceType: 'Lessons'
                        };
                    }
                }
            } );

    } );