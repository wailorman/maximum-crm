// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module( 'starter', [
    'ionic',
    'ngResource',
    //'ngCacheBuster',

    'starter.api',
    'starter.controllers',
    'starter.coaches',
    'starter.halls',
    'starter.groups',
    'starter.clients'
] )

    .run( function ( $ionicPlatform ) {

        $ionicPlatform.ready( function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar( true );
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        } );
    } )

    .service( 'SearchModal', function ( $rootScope, $ionicModal, $q, $log, Api ) {

        var scope = $rootScope.$new();

        scope.searchFilter = {};

        scope.$watch( scope.searchFilter, function () {
            scope.$applyAsync();
        } );

        this.open = function ( parameters ) {
            var deferred = $q.defer();

            // initialize modal
            $ionicModal.fromTemplateUrl( 'templates/search-modal.html', {
                scope: scope,
                animation: 'slide-in-up'
            } ).then( function ( modal ) {

                modal.show();

                // generate title
                scope.title = "Найти группу";

                // generate list
                Api.Groups.query().$promise
                    .then( function ( array ) {
                        scope.items = array;
                    } )
                    .catch( function ( err ) {
                        $log.error( err );
                        deferred.reject();
                    } );

                scope.close = function () {
                    modal.remove();
                };

                scope.choose = function ( item ) {
                    if (!item) modal.remove();

                    if (!item.hasOwnProperty( '_id' ))
                        $log.error( "Item hasn't _id property" );

                    else
                        deferred.resolve( item._id );

                    modal.remove();
                };

            } );

            return deferred.promise;
        };

    } )

    .config( function ( $stateProvider, $urlRouterProvider ) {

        $stateProvider
            .state( 'app', {
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            } )

            .state( 'app.search', {
                url: "/search",
                views: {
                    'menuContent': {
                        templateUrl: "templates/search.html"
                    }
                }
            } )

            .state( 'app.browse', {
                url: "/browse",
                views: {
                    'menuContent': {
                        templateUrl: "templates/browse.html"
                    }
                }
            } )
            .state( 'app.playlists', {
                url: "/playlists",
                views: {
                    'menuContent': {
                        templateUrl: "templates/playlists.html",
                        controller: 'PlaylistsCtrl'
                    }
                }
            } )

            //.state( 'app.coaches', {
            //    url: "/coaches",
            //    resolve: {
            //        additionalStateParams: function () {
            //            return {
            //                listType: 'coaches'
            //            };
            //        }
            //    },
            //    views: {
            //        'menuContent': {
            //            templateUrl: "templates/lists/coaches.html",
            //            controller: 'ListCtrl'
            //        }
            //    }
            //} )

            //.state( 'coaches.view', {
            //    url: "/coaches/{id}",
            //    resolve: {
            //        additionalStateParams: function () {
            //            return {
            //                listType: 'coaches'
            //            };
            //        }
            //    },
            //    views: {
            //        'menuContent': {
            //            templateUrl: "templates/coaches/coaches-view.html",
            //            controller: 'ViewCtrl'
            //        }
            //    }
            //} )

            .state( 'app.single', {
                url: "/playlists/:playlistId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/playlist.html",
                        controller: 'PlaylistCtrl'
                    }
                }
            } );
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise( '/coaches' );
    } );
