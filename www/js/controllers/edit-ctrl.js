angular.module( 'starter.controllers.edit', [] )
    .controller( 'EditCtrl', function ( $rootScope, $scope, $state, $ionicPopup, ResourceCache,
        $ionicHistory, SearchModal, $log, $resource, $filter, $q,
        $stateParams, additionalStateParams, Api, Spinner ) {

        /** @namespace $scope.data._id */
        /** @namespace $scope.data.$update */
        /** @namespace $scope.data.$create */

        $scope.collapseSwitcherValues = {};

        $scope.ResourceCache = ResourceCache;
        $scope.SearchModal = SearchModal;
        $scope.$state = $state;
        $scope.$filter = $filter;

        $scope.load = function () {

            var resourceType = additionalStateParams.resourceType;

            Spinner.show();

            Api[resourceType].get( { id: $stateParams.id } ).$promise
                .then( function ( data ) {
                    // copy original data to watch changes
                    $scope.originalResource = {};
                    angular.copy( data, $scope.originalResource ); // @todo rename to originalData
                    $scope.data = data;

                    $scope.loadAdditionalObjectData();
                } )
                .finally( function () {
                    Spinner.hide();
                } );
        };

        SearchModal.onChoosed( function () {
            $scope.$applyAsync();
        } );

        ///////////////

        $scope.loadAdditionalObjectData = function () {

            var resourceType = additionalStateParams.resourceType,
                data = $scope.data;

            if ( resourceType === 'Lessons' ){

                $scope.lessonAdditionalData = {};

                // date
                var year = data.time.start.getFullYear();
                var month = data.time.start.getMonth()+1;
                var day = data.time.start.getDate();

                $scope.lessonAdditionalData.date = new Date( year + '-' + month + '-' + day );

            }

        };

        $scope.getTimepickerTime = function ( date ) {

            var numberOfSeconds;

            numberOfSeconds = date.getSeconds(); // seconds
            numberOfSeconds = numberOfSeconds + date.getMinutes() * 60; // minutes
            numberOfSeconds = numberOfSeconds + date.getHours() * 3600; // hours

            return numberOfSeconds;

        };

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

            Spinner.show();

            $scope.data.$update( { id: $scope.data._id } )
                .then( function () {
                    $ionicHistory.clearCache();
                    $ionicHistory.goBack();
                } )
                .finally( function () {
                    Spinner.hide();
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

                            Spinner.show();

                            $scope.data.$remove( { id: $scope.data._id } )
                                .catch( function ( err ) {
                                    $log.error( 'Cant remove: ' + err.statusText );
                                } )
                                .then( function () {
                                    Spinner.hide();
                                    $ionicHistory.clearCache();
                                    $ionicHistory.clearHistory();
                                    $ionicHistory.nextViewOptions({
                                        disableBack: true
                                    });
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