angular.module( 'starter.controllers', [] )

    .controller( 'AppCtrl', function ( $scope, $ionicModal, $timeout ) {
        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl( 'templates/login.html', {
            scope: $scope
        } ).then( function ( modal ) {
            $scope.modal = modal;
        } );

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log( 'Doing login', $scope.loginData );

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout( function () {
                $scope.closeLogin();
            }, 1000 );
        };
    } )

    .controller( 'PlaylistsCtrl', function ( $scope ) {
        $scope.playlists = [
            { title: 'Reggae', id: 1 },
            { title: 'Chill', id: 2 },
            { title: 'Dubstep', id: 3 },
            { title: 'Indie', id: 4 },
            { title: 'Rap', id: 5 },
            { title: 'Cowbell', id: 6 }
        ];
    } )

    .controller( 'PlaylistCtrl', function ( $scope, $stateParams ) {
    } )

    .controller( 'ListCtrl', function ( $scope, $state, $ionicLoading, additionalStateParams, Api ) {

        $scope.refresh = function () {

            var resourceType = additionalStateParams.resourceType;

            Api[ resourceType ].query().$promise
                .then( function ( array ) {
                    $scope.items = array;
                } )
                .finally( function () {
                    $scope.$broadcast( 'scroll.refreshComplete' );
                } );


        };

        /////////////////

        $scope.listType = additionalStateParams.listType;
        $scope.items = [];

        //////////////////

        $scope.refresh();

    } )

    .controller( 'ViewCtrl', function ( $rootScope, $scope, $stateParams, $ionicLoading,
                                        additionalStateParams, Api ) {


        $scope.refresh = function () {

            var resourceType = additionalStateParams.resourceType;

            $ionicLoading.show( {
                template: '<ion-spinner class="spinner-energized"></ion-spinner>',
                delay: 300
            } );

            Api[ resourceType ].get( { id: $stateParams.id } ).$promise
                .then( function ( data ) {
                    $scope.data = data;
                } )
                .finally( function () {
                    $ionicLoading.hide();
                    $scope.$broadcast( 'scroll.refreshComplete' );
                } );


        };

        /////////////////

        $scope.viewType = additionalStateParams.viewType;

        //////////////////

        $scope.refresh();


    } )
    .controller( 'EditCtrl', function ( $rootScope, $scope, $state, $ionicPopup, $ionicLoading,
                                        $ionicHistory,
                                        $stateParams, additionalStateParams, Api ) {

        /** @namespace $scope.data._id */
        /** @namespace $scope.data.$update */
        /** @namespace $scope.data.$create */

        $scope.load = function () {

            var resourceType = additionalStateParams.resourceType;

            $ionicLoading.show( {
                template: '<ion-spinner class="spinner-energized"></ion-spinner>',
                delay: 300
            } );

            Api[ resourceType ].get( { id: $stateParams.id } ).$promise
                .then( function ( data ) {
                    // copy original data to watch changes
                    $scope.originalResource = new Api.Coaches;
                    angular.copy( data, $scope.originalResource ); // @todo rename to originalData
                    $scope.data = data;
                } )
                .finally( function () {
                    $ionicLoading.hide();
                } );


        };

        /////////////////

        var rootState = function () {
            return $state.current.name.match( /\w+/ )[ 0 ];
        };

        $scope.applyChanges = function () {

            $ionicLoading.show( {
                template: '<ion-spinner class="spinner-energized"></ion-spinner>',
                delay: 300
            } );

            $scope.data.$update( { id: $scope.data._id } )
                .then( function () {
                    $ionicHistory.clearCache();
                    $state.go( rootState() + '.view', { id: $scope.data._id } );
                } )
                .finally( function () {
                    $ionicLoading.hide();
                } );
        };

        $scope.remove = function () {
            $ionicPopup.show( {
                title: 'Вы уверены?',
                buttons: [
                    { text: 'Нет' },
                    {
                        text: '<b>Да</b>',
                        type: 'button-positive',
                        onTap: function () {
                            $scope.data.$remove( { id: $scope.data._id } );

                            $ionicHistory.clearCache();
                            $ionicHistory.nextViewOptions( { historyRoot: true } );
                            $state.go( rootState() + '.list' );
                        }
                    }
                ]
            } );
        };

        $scope.editType = additionalStateParams.editType;

        ////////////////

        $scope.load();

    } )
    .controller( 'CreateCtrl', function ( $scope, $state, additionalStateParams, Api, $ionicLoading,
                                          $ionicHistory ) {

        var rootState = function () {
            return $state.current.name.match( /\w+/ )[ 0 ];
        };

        var resourceType = additionalStateParams.resourceType;

        $scope.data = new Api[ resourceType ];

        ////////////////

        $scope.create = function () {

            $ionicLoading.show( {
                template: '<ion-spinner class="spinner-energized"></ion-spinner>',
                delay: 300
            } );

            $scope.data.$create()
                .then( function () {
                    $ionicHistory.clearCache();
                    $ionicHistory.nextViewOptions( { historyRoot: true } );
                    $state.go( rootState() + '.list' );
                } )
                .finally( function () {
                    $ionicLoading.hide();
                });

        };

    } );
