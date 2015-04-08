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

    .service( 'List', function ( Api ) {

    } )

    .controller( 'ListCtrl', function ( $scope, $state, additionalStateParams, Api ) {

        $scope.refresh = function () {

            var listType = additionalStateParams.listType;

            if (listType === 'coaches') {
                Api.Coaches.query().$promise.then( receiveData );
            } else if (listType === 'halls') {
                Api.Halls.query().$promise.then( receiveData );
            }

            function receiveData( array ) {
                $scope.items = array;
                $scope.$broadcast( 'scroll.refreshComplete' );
            }

        };

        /////////////////

        $scope.listType = additionalStateParams.listType;
        $scope.items = [];

        //////////////////

        $scope.refresh();

    } )

    .controller( 'ViewCtrl', function ( $rootScope, $scope, $stateParams, additionalStateParams, Api ) {


        $scope.refresh = function () {

            var viewType = additionalStateParams.viewType;

            if (viewType === 'coach') {
                Api.Coaches.get( { id: $stateParams.id } ).$promise.then( receiveData );
            } else if (viewType === 'hall') {
                Api.Halls.get( { id: $stateParams.id } ).$promise.then( receiveData );
            }

            function receiveData( data ) {
                $scope.data = data;
                $scope.$broadcast( 'scroll.refreshComplete' );
            }

        };

        /////////////////

        $scope.viewType = additionalStateParams.viewType;

        //////////////////

        $scope.refresh();


    } )
    .controller( 'EditCtrl', function ( $rootScope, $scope, $state, $ionicPopup,
                                        $stateParams, additionalStateParams, Api ) {

        /** @namespace $scope.data._id */
        /** @namespace $scope.data.$update */
        /** @namespace $scope.data.$create */

        $scope.load = function () {

            var editType = additionalStateParams.editType;

            if (editType === 'coach') {
                Api.Coaches.get( { id: $stateParams.id } ).$promise.then( receiveData );

            } else if (editType === 'hall') {
                Api.Halls.get( { id: $stateParams.id } ).$promise.then( receiveData );
            }

            function receiveData( data ) {
                // copy original data to watch changes
                $scope.originalResource = new Api.Coaches;
                angular.copy( data, $scope.originalResource ); // @todo rename to originalData
                $scope.data = data;
            }

        };

        /////////////////

        var rootState = function () {
            return $state.current.name.match( /\w+/ )[ 0 ];
        };

        $scope.applyChanges = function () {
            $scope.data.$update( { id: $scope.data._id } )
                .then( function () {
                    $state.go( rootState() + '.view', { id: $scope.data._id } );
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
    .controller( 'CreateCtrl', function ( $scope, $state, additionalStateParams, Api ) {



        $scope.data = new Api.Coaches;


        function create() {
            switch (additionalStateParams.createType) {
                case 'coach':
                    $scope.data.$create()
                        .then( function () {
                            $state.go( 'coaches.list' );
                        } );
                    break;
            }
        }

        ////////////////

        $scope.create = create;

        ////////////////

    } );
