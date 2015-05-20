angular.module( 'starter.api', [] )
    .service( 'ResourceCache', function ( $cacheFactory ) {

        var rc = this,
            resourceCache = $cacheFactory( 'resources' );

        rc.put = function ( key, value ) {
            return resourceCache.put( key, value );
        };

        rc.get = function ( key ) {
            return resourceCache.get( key );
        };

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
                "_get": { method: 'GET' },
                'query': { method: 'GET', isArray: true },
                'update': { method: 'PUT' },
                'create': { method: 'POST' },
                'remove': { method: 'DELETE' }
            } ),
            Lessons: $resource( apiUrl + '/lessons/:id', null, {
                'get': { method: 'GET' },
                "_get": { method: 'GET' },
                'query': { method: 'GET', isArray: true },
                '_query': { method: 'GET', isArray: true },
                'update': { method: 'PUT' },
                'create': { method: 'POST' },
                'remove': { method: 'DELETE' }
            } )
        };


        /**
         * Automatically put population array to ResourceCache
         *
         * @param resourceType  Name of cache path (e.g. groups)
         * @param array         Array of ObjectIDs
         * @returns {{$promise: *}}
         */
        var cacheArray = function ( resourceType, array ) {
            var deferred = $q.defer();

            async.each(
                array,
                function ( populateId, ecb ) {

                    var Resource = resources[ resourceType.capitalize() ];

                    Resource.get( { id: populateId } ).$promise
                        .catch( function ( err ) {
                            $log.error( "Can't join " + resourceType + "/" + populateId + ": " + err.statusText );
                        } )
                        .then( function ( data ) {

                            ResourceCache.put( resourceType + '/' + populateId, data );
                            ecb();

                        } );
                },
                function () {
                    deferred.resolve();
                }
            );

            return deferred.promise;
        };


        resources.Clients.get = function ( params ) {
            var deferred = $q.defer();

            resources.Clients._get( params ).$promise
                .catch( deferred.reject )
                .then( function ( data ) {

                    /** @namespace data.consists */

                    // does client consists in any groups
                    if (!data.consists) return deferred.resolve( data );

                    // client consists in some group[s]
                    async.each(
                        data.consists,
                        function ( groupId, ecb ) {

                            resources.Groups.get( { id: groupId } ).$promise
                                .then( function ( data ) {
                                    ResourceCache.put( 'groups/' + data._id, data );
                                } )
                                .catch( function ( err ) {
                                    $log.error( "Can't join groups/" + groupId + ": " + err.statusText );
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
        };

        resources.Lessons.get = function ( params ) {
            var deferred = $q.defer();

            resources.Lessons._get( params ).$promise
                .catch( deferred.reject )
                .then( function ( data ) {

                    data.time.start = new Date( data.time.start );
                    data.time.end = new Date( data.time.end );

                    async.parallel(
                        [
                            // groups
                            function ( pcb ) {

                                if ( ! data.groups ) return pcb();
                                cacheArray( 'groups', data.groups ).then( pcb );

                            },

                            // coaches
                            function ( pcb ) {

                                if ( ! data.coaches ) return pcb();
                                cacheArray( 'coaches', data.coaches ).then( pcb );

                            },

                            // halls
                            function ( pcb ) {

                                if ( ! data.halls ) return pcb();
                                cacheArray( 'halls', data.halls ).then( pcb );

                            }

                        ],
                        function () {
                            deferred.resolve( data );
                        }
                    );

                } );

            return { $promise: deferred.promise };
        };

        resources.Lessons.query = function ( params ) {
            var deferred = $q.defer();

            resources.Lessons._query( params ).$promise
                .catch( deferred.reject )
                .then( function ( array ) {

                    async.each(
                        array,
                        function ( data, ecb ) {

                            data.time.start = new Date( data.time.start );
                            data.time.end = new Date( data.time.end );

                            async.parallel(
                                [
                                    // groups
                                    function ( pcb ) {

                                        if ( ! data.groups ) return pcb();
                                        cacheArray( 'groups', data.groups ).then( pcb );

                                    }

                                ], ecb
                            );

                        },
                        function () {
                            deferred.resolve( array );
                        }
                    );

                } );

            return { $promise: deferred.promise };
        };

        return resources;

    } );