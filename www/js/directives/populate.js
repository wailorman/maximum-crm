angular.module( 'starter.populate', [
    'starter.api'
] )
    .directive( 'populateView', function ( ResourceCache ) {

        var html, singleResource, resourceIds;

        return {
            restrict: 'A',
            scope: {
                itemLabel: '@'
            },
            link: function ( $scope, elem, attrs ) {

                elem.html($scope.itemLabel);

                $scope.$digest();

            }
        };

    } );