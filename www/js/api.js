angular.module( 'starter.api', [] )
    .factory( 'Api', function ( $resource, $q, $log, $cacheFactory ) {

        var apiUrl = 'http://api.max-crm.wailorman.ru:21080';

        var cache = $cacheFactory( 'resources' );

        var resources = {
            Groups: $resource( apiUrl + '/groups/:id', null, {
                'get': { method: 'GET' },
                'query': { method: 'GET', isArray: true },
                'update': { method: 'PUT' },
                'create': { method: 'POST' },
                'remove': { method: 'DELETE' }
            } ),
            Halls: $resource( apiUrl + '/halls/:id', null, {
                'get': { method: 'GET' },
                'query': { method: 'GET', isArray: true },
                'update': { method: 'PUT' },
                'create': { method: 'POST' },
                'remove': { method: 'DELETE' }
            } ),
            Coaches: $resource( apiUrl + '/coaches/:id', null, {
                'get': { method: 'GET' },
                'query': { method: 'GET', isArray: true },
                'update': { method: 'PUT' },
                'create': { method: 'POST' },
                'remove': { method: 'DELETE' }
            } ),
            Clients: $resource( apiUrl + '/clients/:id', null, {
                'get': { method: 'GET' },
                'query': { method: 'GET', isArray: true },
                'update': { method: 'PUT' },
                'create': { method: 'POST' },
                'remove': { method: 'DELETE' }
            } )
        };

        return {
            Groups: resources.Groups,
            Halls: resources.Halls,
            Coaches: resources.Coaches,
            Clients: {
                $get: function ( params ) {
                    var deferred = $q.defer();

                    resources.Clients.get( { id: params.id } )
                        .catch( deferred.reject )
                        .then( function ( data ) {

                            /** @namespace data.consists */

                            // does client consists in any groups
                            if ( !data.consists ) return deferred.resolve( data );

                            // client consists in some group[s]
                            async.each(
                                data.consists,
                                function ( groupId, ecb ) {

                                    resources.Groups.get( { id: groupId } )
                                        .then( function ( data ) {
                                            cache.put( 'groups/' + data._id, data );
                                        } )
                                        .catch( function ( err ) {
                                            $log.error( "Can't join group " + groupId + ": " + err.statusCode + " " + err.message );
                                        } )
                                        .finally( function () {
                                            ecb();
                                        } );

                                },
                                function () {
                                    deferred.resolve( data );
                                }
                            );

                        } );

                    return deferred.promise;
                },
                $query: function ( params ) {
                    return resources.Clients.query( params );
                },
                $update: function ( params ) {
                    return resources.Clients.update( params );
                },
                $create: function () {
                    return resources.Clients.create( params );
                },
                $remove: function () {
                    return resources.Clients.remove( params );
                }
            }

            /*function (  ) {
             $resource( apiUrl + '/clients/:id', null, {
             'get': { method: 'GET' },
             'query': { method: 'GET', isArray: true },
             'update': { method: 'PUT' },
             'create': { method: 'POST' },
             'remove': { method: 'DELETE' }
             });
             }*/
        };

    } );