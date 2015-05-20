angular.module( 'starter.controllers.list', [] )
    .controller( 'ListCtrl', function ( $scope, $state, $ionicHistory, $log,
        ResourceCache, additionalStateParams, Api, Spinner ) {

        $scope.ResourceCache = ResourceCache;

        $scope.refresh = function ( firstRefresh ) {

            $ionicHistory.clearCache();

            var resourceType = additionalStateParams.resourceType;

            if ( firstRefresh )
                Spinner.show();

            Api[resourceType].query().$promise
                .then( function ( array ) {
                    $scope.items = array;
                } )
                .finally( function () {

                    if ( firstRefresh )
                        Spinner.hide();
                    else
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

        $scope.refresh( true ); // first refresh

    } );