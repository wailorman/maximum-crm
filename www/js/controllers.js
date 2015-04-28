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

    .controller( 'ListCtrl', function ( $scope, $state, $ionicLoading, $ionicHistory, $log, ResourceCache, additionalStateParams, Api ) {

        $scope.ResourceCache = ResourceCache;

        $scope.refresh = function () {

            $ionicHistory.clearCache();

            var resourceType = additionalStateParams.resourceType;

            Api[resourceType].query().$promise
                .then( function ( array ) {
                    $scope.items = array;
                } )
                .finally( function () {
                    $scope.$broadcast( 'scroll.refreshComplete' );
                } );


        };

        $scope.getTimeByDate = function ( date ) {
            if ( !date ) return '';

            if ( typeof date == 'number' ) {
                date = new Date( date * 1000 );
                return date.getHours() + ':' + ( date.getMinutes() < 10 ? "0" : "" ) + date.getMinutes();
            } else if ( date instanceof Date ) {
                return date.getHours() + ':' + ( date.getMinutes() < 10 ? "0" : "" ) + date.getMinutes();
            } else {

                try {
                    date = new Date( date );
                    return $scope.getTimeByDate( date );
                } catch ( e ) {
                    $log.error( 'Can not convert date to Date: ' + e );
                }

            }
        };

        /////////////////

        $scope.listType = additionalStateParams.listType;
        $scope.items = [];

        //////////////////

        $scope.refresh();

    } )

    .controller( 'ViewCtrl', function ( $rootScope, $scope, $state, $stateParams, $ionicLoading, $ionicHistory,
        ResourceCache, additionalStateParams, Api ) {

        $scope.collapseSwitcherValues = {};

        $scope.ResourceCache = ResourceCache;
        $scope.$state = $state;

        //$ionicHistory.nextViewOptions( { historyRoot: true } );

        $scope.refresh = function () {

            var resourceType = additionalStateParams.resourceType;

            $ionicLoading.show( {
                template: '<ion-spinner class="spinner-energized"></ion-spinner>',
                delay: 300
            } );

            Api[resourceType].get( { id: $stateParams.id } ).$promise
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

    } )
    .controller( 'CreateCtrl', function ( $rootScope, $scope, $state, additionalStateParams,
        Api, $ionicLoading, ResourceCache, $ionicHistory, SearchModal ) {


        var resourceType = additionalStateParams.resourceType,
            currentDate = new Date();

        $scope.data = new Api[resourceType];
        $scope.SearchModal = SearchModal;
        $scope.ResourceCache = ResourceCache;

        //////////////// DEFAULT PARAMETERS OF NEW RESOURCE

        if ( resourceType == 'Lessons' ) {

            $scope.data.groups = [];
            $scope.data.coaches = [];
            $scope.data.halls = [];

        }

        //////////////// OTHER SPECIFIC FUNCTIONS FOR EACH RESOURCE TYPE

        if ( resourceType == 'Lessons' ) {

            var nextMinuteMultiplieOf15 = ((currentDate.getMinutes() / 15).toFixed().toNumber()) * 15,
                nextEpochTimeMultiplieOf15 = currentDate.getHours() * 3600 + nextMinuteMultiplieOf15 * 60;

            /** @namespace $scope.lessonAdditionalData.startDate */
            /** @namespace $scope.lessonAdditionalData.startTime */
            /** @namespace $scope.lessonAdditionalData.duration */
            $scope.lessonAdditionalData = {
                startDate: new Date( currentDate.setHours(0,0,0,0) ),
                startTime: nextEpochTimeMultiplieOf15, // get epoch time and find nearest *:/15 time
                duration: null
            };

            $scope.$watchCollection( 'lessonAdditionalData', function () {

                    if ( !$scope.data.time ) $scope.data.time = {};

                    var allRequiredDataPassed = $scope.lessonAdditionalData.startDate && $scope.lessonAdditionalData.startTime && $scope.lessonAdditionalData.duration;

                    if ( allRequiredDataPassed ) {

                        var startDate = $scope.lessonAdditionalData.startDate,
                            startTime = $scope.lessonAdditionalData.startTime,
                            duration = $scope.lessonAdditionalData.duration;

                        $scope.data.time.start = new Date( startDate.getTime() + startTime * 1000 );
                        $scope.data.time.end = new Date( $scope.data.time.start.getTime() + duration * 60000 );

                        console.log( 'data.time was changed' );
                        console.log( 'start: ' + $scope.data.time.start.getTime() );
                        console.log( 'end: ' + $scope.data.time.end.getTime() );

                    }

                }
            )
            ;

        }

        //////////////// FUNCTIONS


        $scope.getTimeByDate = function ( date ) {
            if ( !date ) return '';

            if ( typeof date == 'number' ) {
                date = new Date( date * 1000 );
                return date.getUTCHours() + ':' + ( date.getUTCMinutes() < 10 ? "0" : "" ) + date.getUTCMinutes();
            } else {
                return date.getUTCHours() + ':' + ( date.getUTCMinutes() < 10 ? "0" : "" ) + date.getUTCMinutes();
            }
        };

        $scope.beautifyDate = function ( date ) {

            var monthsString = {
                0: 'Янв',
                1: 'Фев',
                2: 'Мар',
                3: 'Апр',
                4: 'Мая',
                5: 'Июн',
                6: 'Июл',
                7: 'Авг',
                8: 'Сен',
                9: 'Окт',
                10: 'Ноя',
                11: 'Дек'
            };

            return date.getDate() + ' ' + monthsString[date.getMonth()] + ' ' + date.getFullYear().toString().last( 2 );
        };

        $scope.create = function () {

            $ionicLoading.show( {
                template: '<ion-spinner class="spinner-energized"></ion-spinner>',
                delay: 300
            } );

            $scope.data.$save()
                .then( function () {
                    $ionicHistory.clearCache();
                    $ionicHistory.goBack();
                } )
                .finally( function () {
                    $ionicLoading.hide();
                } );

        };

    }
)
;
