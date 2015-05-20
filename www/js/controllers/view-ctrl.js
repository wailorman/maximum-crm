angular.module( 'starter.controllers.view', [] )
    .controller( 'ViewCtrl', function ( $rootScope, $scope, $state, $stateParams, $ionicHistory,
        ResourceCache, additionalStateParams, Api, Spinner ) {

        $scope.collapseSwitcherValues = {};
        $scope.collapseTrigger = {};

        $scope.ResourceCache = ResourceCache;
        $scope.$state = $state;

        //$ionicHistory.nextViewOptions( { historyRoot: true } );

        $scope.refresh = function () {

            var resourceType = additionalStateParams.resourceType;

            Spinner.show();

            Api[resourceType].get( { id: $stateParams.id } ).$promise
                .then( function ( data ) {
                    $scope.data = data;
                } )
                .finally( function () {
                    Spinner.hide();
                    $scope.$broadcast( 'scroll.refreshComplete' );
                } );


        };

        /////////////////

        $scope.viewType = additionalStateParams.viewType;

        //////////////////

        $scope.refresh();


    } );