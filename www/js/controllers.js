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

        function loadList () {

            var listType = additionalStateParams.listType;

            switch ( listType ){
                case 'coaches':
                    Api.Coaches.query().$promise
                        .then( function ( array ) {
                            $scope.items = array;
                        } );
                    break;
            }

        }

        $scope.listType = additionalStateParams.listType;
        $scope.items = [];

        //////////////////

        loadList();

        console.log( '234sssssssssreee' );

    } )

    .controller( 'ViewCtrl', function ( $scope, $state, $stateParams, additionalStateParams, Api ) {

        //function loadView () {
        //
        //    var viewType = additionalStateParams.viewType;
        //
        //    switch ( viewType ) {
        //        case 'coach':
        //            Api.Coaches.get( {id: $stateParams.id} ).$promise
        //                .then( function ( data ) {
        //                    $scope.data = data;
        //                } );
        //            break;
        //    }
        //
        //}
        //
        //$scope.viewType = additionalStateParams.viewType;
        //$scope.data = {};
        //
        ////////////////////
        //
        //loadView();

        console.log( '234reee' );


    } );
