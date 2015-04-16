angular.module( 'starter.api', [] )
    .service( 'ResourceCache', function ( $cacheFactory ) {

        var rc = this,
            resourceCache = $cacheFactory( 'resources' );

        rc.put = function ( key, value ) { return resourceCache.put( key, value ); };

        rc.get = function ( key ) { return resourceCache.get( key ); };

    } )
    .factory( 'Api', function ( $resource, $q, $log, ResourceCache ) {

        var apiUrl = 'http://api.max-crm.wailorman.ru:21080';

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
                get: function ( params ) {
                    var deferred = $q.defer();

                    resources.Clients.get( params ).$promise
                        .catch( deferred.reject )
                        .then( function ( data ) {

                            /** @namespace data.consists */

                            // does client consists in any groups
                            if ( !data.consists ) return deferred.resolve( data );

                            // client consists in some group[s]
                            async.each(
                                data.consists,
                                function ( groupId, ecb ) {

                                    resources.Groups.get( { id: groupId } ).$promise
                                        .then( function ( data ) {
                                            ResourceCache.put( 'groups/' + data._id, data );
                                        } )
                                        .catch( function ( err ) {
                                            $log.error( "Can't join group " + groupId + ": " + err.statusText );
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

                    return { $promise: deferred.promise };
                },
                query: function ( params ) {
                    return resources.Clients.query( params );
                },
                update: function ( params ) {
                    return resources.Clients.update( params );
                },
                create: function () {
                    return resources.Clients.create( params );
                },
                remove: function () {
                    return resources.Clients.remove( params );
                }
            }
        };

    } );