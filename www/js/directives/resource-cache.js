var app = angular.module( 'starter.resource-cache', [
    'starter.api'
] );
app.directive( 'resourceCache', function ( ResourceCache ) {


    return {
        restrict: 'EA',
        scope: {
            resourceType: '@',
            field: '@',
            resourceId: '='
        },
        link: function ( scope, elem ) {

            scope.recompile = function ( resourceType, resourceId, field ) {

                if ( !field ) field = 'name';

                var cachedObject = ResourceCache.get( resourceType + '/' + resourceId );

                if ( cachedObject && cachedObject.hasOwnProperty( field ) ) {
                    elem.html( cachedObject[field] );
                }

            };

            scope.$watch( 'resourceId', function () {

                scope.recompile(
                    scope.resourceType,
                    scope.resourceId,
                    scope.field
                );

            }, true );
        }
    };

} );