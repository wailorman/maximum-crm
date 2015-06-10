angular.module( 'starter.populate', [
    'starter.api'
] )
    .directive( 'populateView', function ( ResourceCache ) {

        var html, singleResource, resourceIds, values, objectFromCache;

        return {
            restrict: 'A',
            scope: {
                itemLabel: '@',
                resourceType: '@',
                populationKey: '='
            },
            link: function ( $scope, elem, attrs ) {

                $scope.$watch( 'populationKey', function () {

                    values = '';

                    if ( typeof $scope.populationKey === 'string' ){

                        objectFromCache = ResourceCache.get( $scope.resourceType + '/' + $scope.populationKey );
                        if ( objectFromCache ) values = objectFromCache.name;
                        else values = '';

                    }
                    else if ( $scope.populationKey instanceof Array ){

                        for ( var i in $scope.populationKey ){
                            if ( $scope.populationKey.hasOwnProperty(i) && typeof $scope.populationKey[i] === 'string' ){

                                objectFromCache = ResourceCache.get( $scope.resourceType + '/' + $scope.populationKey[i] );

                                if ( objectFromCache ) {
                                    if ( i == 0 ){
                                        values = objectFromCache.name;
                                    }else{
                                        values = values + ', ' + objectFromCache.name
                                    }
                                }

                            }
                        }

                    }
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