angular.module( 'starter.controllers.view', [] )
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