angular.module( 'starter.controllers.list', [] )
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