angular.module( 'starter.api', [
    'ngResource'
] )
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
                'get': { method: 'GET', timeout: 5000 },
                'query': { method: 'GET', isArray: true, timeout: 5000 },
                'update': { method: 'PUT', timeout: 5000 },
                'create': { method: 'POST', timeout: 5000 },
                'remove': { method: 'DELETE', timeout: 5000 }
            } ),
            Halls: $resource( apiUrl + '/halls/:id', null, {
                'get': { method: 'GET', timeout: 5000 },
                'query': { method: 'GET', isArray: true, timeout: 5000 },
                'update': { method: 'PUT', timeout: 5000 },
                'create': { method: 'POST', timeout: 5000 },
                'remove': { method: 'DELETE', timeout: 5000 }
            } ),
            Coaches: $resource( apiUrl + '/coaches/:id', null, {
                'get': { method: 'GET', timeout: 5000 },
                'query': { method: 'GET', isArray: true, timeout: 5000 },
                'update': { method: 'PUT', timeout: 5000 },
                'create': { method: 'POST', timeout: 5000 },
                'remove': { method: 'DELETE', timeout: 5000 }
            } ),
            Clients: $resource( apiUrl + '/clients/:id', null, {
                'get': { method: 'GET', timeout: 5000 },
                "_get": { method: 'GET', timeout: 5000 },
                'query': { method: 'GET', isArray: true, timeout: 5000 },
                'update': { method: 'PUT', timeout: 5000 },
                'create': { method: 'POST', timeout: 5000 },
                'remove': { method: 'DELETE', timeout: 5000 }
            } ),
            Lessons: $resource( apiUrl + '/lessons/:id', null, {
                'get': { method: 'GET', timeout: 5000 },
                "_get": { method: 'GET', timeout: 5000 },
                'query': { method: 'GET', isArray: true, timeout: 5000 },
                '_query': { method: 'GET', isArray: true, timeout: 5000 },
                'update': { method: 'PUT', timeout: 5000 },
                'create': { method: 'POST', timeout: 5000 },
                'remove': { method: 'DELETE', timeout: 5000 }
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
            var deferred = $q.defer(),
                object = {};

            resources.Lessons._get( params ).$promise
                .catch( deferred.reject )
                .then( function ( document ) {

                    async.parallel(
                        [
                            // coaches
                            function ( pcb ) {

                                if (document.coaches) {

                                    object.coaches = [];
                                    async.each( document.coaches, function ( coach, ecb ) {

                                        resources.Coaches.get( { id: coach } ).$promise
                                            .then( function ( coachDocument ) {

                                                object.coaches.push( coachDocument );
                                                return ecb();

                                            }, function ( err ) {
                                                return ecb();
                                            } );

                                    }, function () {
                                        pcb();
                                    } );

                                }else return pcb();

                            }
                        ],
                        function () {
                            deferred.resolve( object );
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

                                        if (!data.groups) return pcb();
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