var app = angular.module( 'starter.resource-cache', [] );
app.directive( 'resourceCache', function ( ResourceCache ) {



    return {
        restrict: 'A',
        scope: {
            resourceType: '@',
            field: '@',
            resourceId: '='
        },
        link: function ( scope, elem ) {

            scope.$watch( 'resourceId', function () {

                var resourceType = scope.resourceType,
                    field = scope.field ? scope.field : 'name',
                    resourceId = scope.resourceId;

                var cachedObject = ResourceCache.get( resourceType + '/' + resourceId );


                if ( cachedObject && cachedObject.hasOwnProperty( field ) ) {
                    elem.html( cachedObject[field] );
                }

            }, true );
        }
    };

} );