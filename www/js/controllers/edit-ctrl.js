angular.module( 'starter.controllers.edit', [] )
    .controller( 'EditCtrl', function ( $rootScope, $scope, $state, $ionicPopup, $ionicLoading, ResourceCache,
        $ionicHistory, SearchModal, $log, $resource,
        $stateParams, additionalStateParams, Api ) {

        /** @namespace $scope.data._id */
        /** @namespace $scope.data.$update */
        /** @namespace $scope.data.$create */

        $scope.collapseSwitcherValues = {};

        $scope.ResourceCache = ResourceCache;
        $scope.SearchModal = SearchModal;
        $scope.$state = $state;
        $scope.load = function () {

            var resourceType = additionalStateParams.resourceType;

            $ionicLoading.show( {
                template: '<ion-spinner class="spinner-energized"></ion-spinner>',
                delay: 300
            } );

            Api[resourceType].get( { id: $stateParams.id } ).$promise
                .then( function ( data ) {
                    // copy original data to watch changes
                    $scope.originalResource = {};
                    angular.copy( data, $scope.originalResource ); // @todo rename to originalData
                    $scope.data = data;
                } )
                .finally( function () {
                    $ionicLoading.hide();
                } );


        };

        SearchModal.onChoosed( function () {
            $scope.$applyAsync();
        } );

        ///////////////

        ///////////////

        $scope.openModal = function () {
            SearchModal.open().then( function ( _id ) {

                $log.debug( 'Ive choosed this id: ' + _id );

            } );
        };

        /////////////////

        var rootState = function () {
            return 'app.' + $state.current.name.match( /\w+/g )[1];
        };

        $scope.applyChanges = function () {

            $ionicLoading.show( {
                template: '<ion-spinner class="spinner-energized"></ion-spinner>',
                delay: 300
            } );

            $scope.data.$update( { id: $scope.data._id } )
                .then( function () {
                    $ionicHistory.clearCache();
                    $ionicHistory.goBack();
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

                            $ionicLoading.show( {
                                template: '<ion-spinner class="spinner-energized"></ion-spinner>',
                                delay: 300
                            } );

                            $scope.data.$remove( { id: $scope.data._id } )
                                .catch( function ( err ) {
                                    $log.error( 'Cant remove: ' + err.statusText );
                                } )
                                .then( function () {
                                    $ionicLoading.hide();
                                    $ionicHistory.clearCache();
                                    $state.go( rootState() );
                                } );
                        }
                    }
                ]
            } );
        };

        $scope.editType = additionalStateParams.editType;

        ////////////////

        $scope.load();

    } );