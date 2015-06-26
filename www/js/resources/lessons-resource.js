angular.module( 'starter.api.lessons', [

    'starter.api.coaches',
    'starter.api.halls',
    'starter.api.groups',

    'ngResource'

] )
    .factory( 'Lessons', function ( Coaches,
        Halls,
        Groups,
        $resource, $q, $log ) {

        var apiUrl = 'http://api.max-crm.wailorman.ru:21080';

        var Lessons = $resource( apiUrl + '/lessons/:id', null, {

            '_get': { method: 'GET', timeout: 5000 },
            '_query': { method: 'GET', isArray: true, timeout: 5000 },
            'update': { method: 'PUT', timeout: 5000 },
            '_create': { method: 'POST', timeout: 5000 },
            'remove': { method: 'DELETE', timeout: 5000 }

        } );

        /**
         * Get extended time object by simple time object
         *
         * @param {object} timeObject
         * @param {Date} timeObject.start
         * @param {Date} timeObject.end
         *
         * @throws Error( 'Not enough params' )
         *
         * @return {object} Extended time object
         */
        Lessons.getExtendedTimeBySimple = function ( timeObject ) {
            var resultTime = {},
                durationInMs;

            if ( !timeObject.start || !timeObject.end ) {
                throw new Error( 'Not enough params' );
                return undefined;
            }

            resultTime.start = timeObject.start;
            resultTime.end = timeObject.end;

            resultTime.date = new Date(
                timeObject.start.getFullYear(),
                timeObject.start.getMonth(),
                timeObject.start.getDate()
            );

            resultTime.epochStart = resultTime.start.getHours() * 3600 + resultTime.start.getMinutes();

            durationInMs = resultTime.end.getTime() - resultTime.start.getTime();

            resultTime.duration = Math.floor( durationInMs / 1000 / 60 );
            //                                                 |     |
            //                                                 |     |
            //                                                 |     + to minutes
            //                                                 |
            //                                                 + to seconds

            return resultTime;
        };

        /**
         * Get extended time object by simple time object
         *
         * @param {object}  timeObject
         * @param {Date}    timeObject.date
         * @param {Number}  [timeObject.epochStart]     Default = 0
         * @param {Number}  [timeObject.duration]       Default = 0
         *
         * @throws Error( 'Not enough params (date missing)' )
         *
         * @return {object} Extended time object
         */
        Lessons.getSimpleTimeByExtended = function ( timeObject ) {

            var resultTime = {};

            if ( !timeObject.date ) {
                throw new Error( 'Not enough params (date missing)' );
                return undefined;
            }

            if ( !timeObject.epochStart ) timeObject.epochStart = 0;
            if ( !timeObject.duration ) timeObject.duration = 0;

            resultTime.start = new Date( timeObject.date.getTime() + timeObject.epochStart * 1000 );
            resultTime.end = new Date( resultTime.start.getTime() + timeObject.duration * 60 * 1000 );

            return resultTime;
        };

        /**
         * Get populated array by array of IDs.
         * Async function
         *
         * Method don't stop working if it can't find some of objects.
         * On every error response (e.g. 404) it will call deferred.notify.
         * So, if it can't find two objects, it will calls notify function twice.
         * But! If method can't find all of requested objects it will call reject
         *
         * So
         * notify -- calls on every error
         * reject -- calls only if all requests respond an error
         * resolve -- calls after all requests been responded. Args: resultArray (already populated)
         *
         * @param {Resource} resource Should have _get() func!
         * @param {array|Array} arrayOfIds
         */
        Lessons.populateArray = function ( resource, arrayOfIds ) {
            var deferred = $q.defer(),
                resultArray = [],
                numberOfErrorResponds = 0;

            async.each(
                arrayOfIds,
                function ( objectId, ecb ) {

                    resource._get( { id: objectId } ).$promise
                        .then(
                        function ( coach ) {
                            resultArray.push( coach );
                            ecb();
                        },
                        function () {
                            numberOfErrorResponds++;
                            deferred.notify( "Can't find " + objectId );
                            ecb();
                        }
                    );

                },
                function () {
                    if ( numberOfErrorResponds == arrayOfIds.length ) {
                        deferred.reject( "Can't find any object" );
                    } else if ( numberOfErrorResponds < arrayOfIds.length && resultArray ) {
                        deferred.resolve( resultArray );
                    }
                }
            );

            return deferred.promise;
        };

        /**
         * Depopulate array.
         * Converting array of objects to plane array.
         * Sync function
         *
         * @param {array|Array} arrayOfObjects Elements of this array can be objects (with _id property!), strings and numbers
         *
         * @return {array|Array}
         */
        Lessons.depopulateArray = function ( arrayOfObjects ) {

            var resultArray = [];

            if ( !arrayOfObjects ) {
                $log.error( 'Missing array' );
            } else {

                arrayOfObjects.forEach( function ( elem ) {

                    if ( typeof elem === 'object' ) {

                        if ( elem._id ) {
                            resultArray.push( elem._id );
                        } else {
                            $log.error( 'Some object in array does not have _id property' );
                        }

                    } else if ( typeof elem === 'string' || typeof elem === 'number' ) {

                        resultArray.push( elem );

                    }

                } );

            }

            return resultArray;

        };

        /**
         *
         * @todo Add __v property
         *
         * @param {object} params
         * @param {string} params.id
         */
        Lessons.get = function ( params ) {
            var deferred = $q.defer(),
                resultObject = {};

            Lessons._get( params ).$promise
                .then(
                function ( document ) {

                    // time
                    resultObject.time = Lessons.getExtendedTimeBySimple( document.time );

                    // populate arrays
                    async.parallel(
                        [
                            // coaches
                            function ( pcb ) {

                                Lessons.populateArray( Coaches, document.coaches )

                                    .then( function ( populatedCoaches ) {
                                        resultObject.coaches = populatedCoaches;
                                    }, function () { //error. nothing to catch!

                                    }, deferred.notify )

                                    .finally( pcb );

                            },

                            // halls
                            function ( pcb ) {

                                Lessons.populateArray( Halls, document.halls )

                                    .then( function ( populatedHalls ) {
                                        resultObject.halls = populatedHalls;
                                        pcb();
                                    }, function () { //error. nothing to catch!

                                    }, deferred.notify )

                                    .finally( pcb );

                            },

                            // groups
                            function ( pcb ) {

                                Lessons.populateArray( Groups, document.groups )

                                    .then( function ( populatedGroups ) {
                                        resultObject.groups = populatedGroups;
                                        pcb();
                                    }, function () { //error. nothing to catch!

                                    }, deferred.notify )

                                    .finally( pcb );

                            }
                        ],
                        function () {
                            deferred.resolve( resultObject );
                        }
                    );

                },
                deferred.reject,
                deferred.notify
            );

            return { $promise: deferred.promise };
        };

        /**
         * Getting Lesson object as argument and send document to the server.
         * Throws an error if _id was not passed or extended time is invalid.
         * Coaches/halls/groups array can be object (with _id property), string or integer array.
         * If coaches/halls/groups array will not passed, method will use empty array as a value.
         *
         * @throws Error( 'Missing _id' )
         * @throws Error( 'Invalid time' )
         *
         * @param {object}      data            Lesson object
         * @param {string}      data._id
         * @param {object}      data.time       Extended Lesson time
         * @param {Array.<Object>|Array.<String>|Array.<Number>} data.coaches
         * @param {Array.<Object>|Array.<String>|Array.<Number>} data.halls
         * @param {Array.<Object>|Array.<String>|Array.<Number>} data.groups
         */
        Lessons.create = function ( data ) {
            var deferred = $q.defer(),
                resultDocument = {};

            // id
            if ( data._id )
                resultDocument._id = data._id;
            else
                throw new Error( 'Missing _id' );

            // time
            try {
                resultDocument.time = Lessons.getSimpleTimeByExtended( data.time );
            } catch ( e ) {
                throw new Error( 'Invalid time' );
            }

            resultDocument.coaches = Lessons.depopulateArray( data.coaches );
            resultDocument.halls = Lessons.depopulateArray( data.halls );
            resultDocument.groups = Lessons.depopulateArray( data.groups );


            Lessons._create( resultDocument ).$promise
                .then( deferred.resolve, deferred.reject );

            return { $promise: deferred.promise };
        };

        return Lessons;

    } );