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

        // If resource has private get method ( e.g. _get() ) this method will
        // return plain document from API

        // Public get() method will return beautiful object

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
                .then( function ( document ) {

                    if ( !document._id ) return deferred.reject();

                    object._id = document._id;

                    // nested documents

                    //
                    // convert plain stringObjectID array to populated objects
                    // example:
                    //
                    // ...
                    // coaches: [ '689ads6b6c6a6fb9a7c6a9f6', '689ads6b6c6a6fb9a7c6a000' ],
                    // ...
                    //
                    // to -->
                    //
                    // ...
                    // coaches: [
                    //     {
                    //         _id: '689ads6b6c6a6fb9a7c6a9f6',
                    //         name: 'Best coach ever'
                    //     },
                    //     ...
                    // ],
                    // ...
                    //



                    async.parallel(
                        [
                            // time
                            function ( pcb ) {

                                if (document.time && document.time.start && document.time.end) {

                                    object.time = {};

                                    object.time.start = document.time.start;
                                    object.time.end = document.time.end;

                                    // date
                                    object.time.date = angular.copy( document.time.start ); // calculating from lesson start time
                                    object.time.date.setHours( 0 );
                                    object.time.date.setMinutes( 0 );
                                    object.time.date.setSeconds( 0 );
                                    object.time.date.setMilliseconds( 0 );

                                    // epochStart
                                    // Number of seconds from start of the day to start of the lesson
                                    object.time.epochStart = (document.time.start.getHours() * 3600) + (document.time.start.getMinutes() * 60);

                                    // duration
                                    // Number of minutes from start of the lesson
                                    var unixTimeStart = document.time.start.getTime(),
                                        unixTimeEnd = document.time.end.getTime();

                                    object.time.duration = ( unixTimeEnd - unixTimeStart ) / 60 / 1000;

                                }

                                pcb();

                            },

                            // coaches
                            function ( pcb ) {

                                if (document.coaches) {

                                    object.coaches = [];
                                    async.each( document.coaches, function ( coach, ecb ) {

                                        resources.Coaches.get( { id: coach } ).$promise
                                            .then( function ( coachDocument ) {

                                                object.coaches.push( coachDocument );
                                                return ecb();

                                            }, function () {
                                                return ecb();
                                            } );

                                    }, function () {
                                        pcb();
                                    } );

                                }else return pcb();

                            },

                            // groups
                            function ( pcb ) {

                                if (document.groups) {

                                    object.groups = [];
                                    async.each( document.groups, function ( group, ecb ) {

                                        resources.Groups.get( { id: group } ).$promise
                                            .then( function ( groupDocument ) {

                                                object.groups.push( groupDocument );
                                                return ecb();

                                            }, function () {
                                                return ecb();
                                            } );

                                    }, function () {
                                        pcb();
                                    } );

                                }else return pcb();

                            },

                            // halls
                            function ( pcb ) {

                                if (document.halls) {

                                    object.halls = [];
                                    async.each( document.halls, function ( hall, ecb ) {

                                        resources.Halls.get( { id: hall } ).$promise
                                            .then( function ( hallDocument ) {

                                                object.halls.push( hallDocument );
                                                return ecb();

                                            }, function () {
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

                },deferred.reject );

            return { $promise: deferred.promise };
        };

        resources.Lessons._convert2document = function ( object ) {

            var document = {};

            ////////   TIME   /////////

            document.time = {};

            document.time.start = object.time.date;
            document.time.end = object.time.date;

            return document;

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