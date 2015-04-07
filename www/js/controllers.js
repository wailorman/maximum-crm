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
            {title: 'Reggae', id: 1},
            {title: 'Chill', id: 2},
            {title: 'Dubstep', id: 3},
            {title: 'Indie', id: 4},
            {title: 'Rap', id: 5},
            {title: 'Cowbell', id: 6}
        ];
    } )

    .controller( 'PlaylistCtrl', function ( $scope, $stateParams ) {
    } )

    .service( 'List', function ( Api ) {

    } )

    .controller( 'ListCtrl', function ( $scope, $state, additionalStateParams, Api ) {

        function loadList() {

            switch (additionalStateParams.listType) {
                case 'coaches':
                    $scope.refresh = function () {
                        Api.Coaches.query().$promise
                            .then( function ( array ) {
                                $scope.items = array;
                                $scope.$broadcast( 'scroll.refreshComplete' );
                            } );
                    };
                    $scope.refresh();
                    break;
            }

        }

        $scope.listType = additionalStateParams.listType;
        $scope.items = [];

        //////////////////

        loadList();

        console.log( 'list controller' );

    } )

    .controller( 'ViewCtrl', function ( $rootScope, $scope, $stateParams, additionalStateParams, Api ) {

        function loadView() {

            switch (additionalStateParams.viewType) {
                case 'coach':
                    $scope.refresh = function () {
                        Api.Coaches.get( {id: $stateParams.id} ).$promise
                            .then( function ( data ) {
                                $scope.data = data;
                                $scope.$broadcast( 'scroll.refreshComplete' );
                            } );
                    };
                    $scope.refresh();
                    break;
            }

        }

        /////////////////

        $scope.viewType = additionalStateParams.viewType;

        //////////////////

        loadView();

        console.log( 'view controller' );


    } )
    .controller( 'EditCtrl', function ( $rootScope, $scope, $state,
                                        $stateParams, additionalStateParams, Api ) {

        function loadEdit() {

            switch (additionalStateParams.editType) {
                case 'coach':
                    Api.Coaches.get( {id: $stateParams.id} ).$promise
                        .then( function ( data ) {
                            // copy original data to watch changes
                            $scope.originalResource = new Api.Coaches;
                            angular.copy( data, $scope.originalResource );
                            $scope.data = data;
                        } );

                    break;
            }

        }

        /////////////////

        $scope.applyChanges = function () {
            $scope.data.$update( {id: $scope.data._id} )
                .then( function () {
                    $state.go( 'coaches.view', {id: $scope.data._id} );
                } );
        };

        $scope.remove = function () {

        };

        $scope.editType = additionalStateParams.editType;

        ////////////////

        loadEdit();

    } )
    .controller( 'CreateCtrl', function ( $scope, $state, additionalStateParams, Api ) {



            //switch (additionalStateParams.createType) {
            //    case 'coach':
                    $scope.data = new Api.Coaches;
                    //break;
            //}



        function create() {
            switch (additionalStateParams.createType) {
                case 'coach':
                    $scope.data.$create()
                        .then( function () {
                            $state.go( 'coaches.list' );
                        });
                    break;
            }
        }

        ////////////////

        $scope.create = create;

        ////////////////

    } );
