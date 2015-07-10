angular.module( 'starter.api.interceptors', [] )
    .factory( 'httpErrorInterceptor', function ( $q ) {

        return {

            responseError: function ( rejection ) {

                return $q.reject( new HttpError(
                    rejection.status,
                    rejection.statusText,
                    rejection.config,
                    rejection.data
                ) );

            }

        };

    } )
    .config( function ( $httpProvider ) {

        $httpProvider.interceptors.push( 'httpErrorInterceptor' );

    } );