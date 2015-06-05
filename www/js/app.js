// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module( 'starter', [
    'ionic',
    'ngResource',

    'ionic-timepicker',
    'ionic-datepicker',

    'ui.bootstrap.tpls',
    'ui.bootstrap.tooltip',

    'starter.api',
    'starter.controllers',
    'starter.coaches',
    'starter.halls',
    'starter.groups',
    'starter.clients',
    'starter.lessons',

    'starter.resource-cache'
] )

    .run( function ( $ionicPlatform ) {

        $ionicPlatform.ready( function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if ( window.cordova && window.cordova.plugins.Keyboard ) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar( true );
            }
            if ( window.StatusBar ) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        } );
    } )

    .service( 'SearchModal', function ( $rootScope, $ionicModal, $q, $log, Api, ResourceCache ) {

        var scope = $rootScope.$new(),
            sm = this;

        scope.searchFilter = {};

        scope.$watch( scope.searchFilter, function () {
            scope.$applyAsync();
        } );

        var callOnChoosed = function () {};

        sm.onChoosed = function ( func ) {
            callOnChoosed = func;
        };

        /**
         *
         * @param {object} parameters
         * @param {string} parameters.title         Title of the modal
         * @param {string} parameters.resourceType  Resource which from list will be loaded
         * @param {string} parameters.arrayToPush   Array for pushing choosed result (if using array)
         * @param {string} parameters.varToPut      Variable for putting choosed result (if using variable)
         * @returns {*}
         */
        sm.open = function ( parameters ) {
            var deferred = $q.defer();

            // initialize modal
            $ionicModal.fromTemplateUrl( 'templates/search-modal.html', {
                scope: scope,
                animation: 'slide-in-up',
                focusFirstInput: true
            } ).then( function ( modal ) {

                modal.show();

                // generate title
                scope.title = parameters.title;

                // generate list
                Api[parameters.resourceType].query().$promise
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
                    if ( !item ) modal.remove();

                    if ( !item.hasOwnProperty( '_id' ) ) {

                        $log.error( "Item hasn't _id property" );

                    } else {

                        Api[parameters.resourceType].get( { id: item._id } ).$promise
                            .catch( function ( err ) {
                                $log.error( 'Can not cache choosed object: ' + err.statusText );
                            } )
                            .then( function ( data ) {

                                ResourceCache.put( parameters.resourceType.toLowerCase() + '/' + item._id, data );

                                if ( parameters.arrayToPush ) {

                                    // to avoid id duplicate
                                    if ( !parameters.arrayToPush.find( item._id ) ) {

                                        parameters.arrayToPush.push( item._id );

                                    }
                                }

                                if ( parameters.varToPut ) parameters.varToPut = item._id;

                                $rootScope.$applyAsync( callOnChoosed );

                                deferred.resolve( item._id );

                            } );
                    }

                    modal.remove();
                };

            } );

            return deferred.promise;
        };

    } )

    .service( 'Spinner', function ( $ionicLoading, $rootScope ) {

        var scope = $rootScope.$new();

        scope.hideSpinner = function () {
            return $ionicLoading.hide();
        };

        this.show = function () {
            $ionicLoading.show( {
                template: '<ion-spinner class="spinner-energized" ng-click="hideSpinner()"></ion-spinner>',
                scope: scope,
                delay: 300
            } );
        };

        this.hide = function () {
            $ionicLoading.hide();
        };

    } )

    .service( 'Popup', function ( $rootScope, $ionicPopup ) {

        /**
         * Show error popup
         * @param firstArg {string} If passed one arg it will be message. If two args it will be title
         * @param [secondArg] {string} If two args passed it will be subTitle
         */
        this.showErrorPopup = function ( firstArg, secondArg ) {

            var parameters = {
                    scope: $rootScope.$new(),
                    buttons: [
                        { text: 'OK' }
                    ]
                };

            if ( secondArg ) { // if second argument passed
                parameters.subTitle = secondArg;
                parameters.title = firstArg;
            } else {
                parameters.title = firstArg;
            }

            $ionicPopup.show( parameters );

        };

    } )

    .config( function ( $stateProvider, $urlRouterProvider ) {

        $stateProvider
            .state( 'app', {
                abstract: true,
                url: '',
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
