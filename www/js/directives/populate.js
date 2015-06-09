angular.module( 'starter.populate', [
    'starter.api'
] )
    .directive( 'populateView', function ( ResourceCache ) {

        var html, singleResource, resourceIds, values;

        return {
            restrict: 'A',
            scope: {
                itemLabel: '@',
                resourceType: '@',
                populationKey: '='
            },
            link: function ( $scope, elem, attrs ) {

                $scope.$watch( 'populationKey', function () {

                    values = ResourceCache.get( $scope.resourceType + '/' + $scope.populationKey );
                    if ( values ) values = values.name;
                    else values = '';

                    html = $scope.itemLabel ? $scope.itemLabel : '';

                    if ( values ) {
                        html = html + '<span class="item-note">' +
                        values +
                        '</span>';
                    } else {
                        html = html + '';
                    }

                    elem.html( html );

                } );

            }
        };

    } );