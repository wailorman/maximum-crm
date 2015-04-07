angular.module( 'starter.api', [] )
    .factory( 'Api', function ( $resource ) {

        return {
            Coaches: $resource( 'http://192.168.0.60:21080/coaches/:id' )
        };

    } );