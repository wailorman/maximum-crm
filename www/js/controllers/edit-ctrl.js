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
                var year = data.time.start.getFullYear(),
                    month = data.time.start.getMonth() + 1,
                    day = data.time.start.getDate();

                $scope.lessonAdditionalData.date = new Date( year + '-' + month + '-' + day );

                // startTimeInSeconds
                var startSeconds = data.time.start.getSeconds(),
                    startMinutesInSeconds = data.time.start.getMinutes() * 60,
                    startHoursInSeconds = data.time.start.getHours() * 3600;

                $scope.lessonAdditionalData.startTimeInSeconds = startSeconds + startMinutesInSeconds + startHoursInSeconds;

                // durationInMinutes
                var startMilliseconds = data.time.start.getTime(),
                    endMilliseconds = data.time.end.getTime();

                $scope.lessonAdditionalData.durationInMinutes = ( endMilliseconds - startMilliseconds ) / 1000 / 60;

                $scope.lessonAdditionalData.getStringStartTime = function () {
                    var date = new Date( $scope.lessonAdditionalData.startTimeInSeconds * 1000 );
                    return $filter( 'date' )( date, 'H:mm', 'UTC' );
                }

            }

        };

        $scope.applyAdditionalObjectData = function () {

            // date

            var date = $scope.lessonAdditionalData.date;

            $scope.data.time.start = date;
            $scope.data.time.end = date;

            // startTime

            var startHour = (new Date( $scope.lessonAdditionalData.startTimeInSeconds * 1000 )).getUTCHours(),
                startMinute = ( $scope.lessonAdditionalData.startTimeInSeconds - (startHour*3600) ) / 60;

            $scope.data.time.start.setHours( startHour );
            $scope.data.time.start.setMinutes( startMinute );

            // duration

            var millisecondsTimeStart = $scope.data.time.start.getTime(),
                durationInMilliseconds = $scope.lessonAdditionalData.durationInMinutes * 60 * 1000;

            $scope.data.time.end = new Date( millisecondsTimeStart + durationInMilliseconds );

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