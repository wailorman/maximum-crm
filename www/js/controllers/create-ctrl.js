angular.module( 'starter.controllers.create', [] )
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
                startDate: new Date( currentDate.setHours( 0, 0, 0, 0 ) ),
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