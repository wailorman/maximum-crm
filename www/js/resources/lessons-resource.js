angular.module( 'starter.api.lessons', [

    'starter.api.helper',
    
    'starter.api.coaches',
    'starter.api.halls',
    'starter.api.groups',

    'ngResource'

] )
    .factory( 'Lessons', function ( Coaches,
        Halls,
        Groups,
        ApiHelper,
        $resource, $q, $log ) {

        var apiUrl = 'http://api.max-crm.wailorman.ru:21080';

        var Lessons = $resource( apiUrl + '/lessons/:id', null, {

            '_get': { method: 'GET', timeout: 5000 },
            '_query': { method: 'GET', isArray: true, timeout: 5000 },
            '_update': { method: 'PUT', timeout: 5000 },
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

            if ( !timeObject.start || !timeObject.end )
                throw new InvalidArgumentError( 'Not enough params' );

            if ( !(timeObject.start instanceof Date) || !(timeObject.end instanceof Date) )
                throw new InvalidArgumentError( 'Invalid time object. start or end property are not instance of Date' );

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

            if ( !timeObject.date )
                throw new InvalidArgumentError( 'Not enough params (date missing)' );

            if ( !(timeObject.date instanceof Date) )
                throw new InvalidArgumentError( 'date property should be instance of Date' );

            if ( typeof timeObject.epochStart !== 'number' )
                throw new InvalidArgumentError( 'epochStart property should be number' );

            if ( typeof timeObject.duration !== 'number' )
                throw new InvalidArgumentError( 'duration property should be number' );

            if ( !timeObject.epochStart ) timeObject.epochStart = 0;
            if ( !timeObject.duration ) timeObject.duration = 0;

            resultTime.start = new Date( timeObject.date.getTime() + timeObject.epochStart * 1000 );
            resultTime.end = new Date( resultTime.start.getTime() + timeObject.duration * 60 * 1000 );

            return resultTime;
        };


        /**
         * Convert document from server to object.
         * If some errors happened while executing, they will be $logged
         * or notified by promise (see ApiHelper.populateArray).
         *
         * All errors can be only internal, because this method converting
         * document from server, not from user.
         *
         * @throws see Lessons.getExtendedTimeBySimple
         * @throws Error( 'Missing document' )
         *
         * @param {object} document
         */
        Lessons.documentToObject = function ( document ) {


            var deferred = $q.defer(),
                resultObject = {};

            if ( !document )
                throw new InvalidArgumentError( 'Missing document' );

            if ( !document._id )
                $log.error( new InvalidArgumentError( 'Missing _id property in document' ) );

            if ( document.time ) {

                if ( !document.time.start )
                    $log.error( new InvalidArgumentError( 'Missing time.start property in document' ) );

                if ( !document.time.end )
                    $log.error( new InvalidArgumentError( 'Missing time.end property in document' ) );

            } else
                $log.error( new InvalidArgumentError( 'Missing time property in document' ) );


            /////////////////////////////////////////////////////


            if ( document._id )
                resultObject._id = document._id;

            if ( document.time && document.time.start && document.time.end )
                resultObject.time = Lessons.getExtendedTimeBySimple( document.time );


            // populate arrays
            async.parallel(
                [
                    // coaches
                    function ( pcb ) {

                        try {

                            ApiHelper.populateArray( Coaches, document.coaches )

                                .then( function ( populatedCoaches ) {
                                    resultObject.coaches = populatedCoaches;
                                }, function () {
                                    resultObject.coaches = [];
                                }, deferred.notify )

                                .finally( pcb );

                        } catch ( e ) {
                            resultObject.coaches = [];
                            pcb();
                        }

                    },

                    // halls
                    function ( pcb ) {

                        try {

                            ApiHelper.populateArray( Halls, document.halls )

                                .then( function ( populatedHalls ) {
                                    resultObject.halls = populatedHalls;
                                }, function () {
                                    resultObject.halls = [];
                                }, deferred.notify )

                                .finally( pcb );

                        } catch ( e ) {
                            resultObject.halls = [];
                            pcb();
                        }

                    },

                    // groups
                    function ( pcb ) {

                        try {

                            ApiHelper.populateArray( Groups, document.groups )

                                .then( function ( populatedGroups ) {
                                    resultObject.groups = populatedGroups;
                                }, function () {
                                    resultObject.groups = [];
                                }, deferred.notify )

                                .finally( pcb );

                        } catch ( e ) {
                            resultObject.groups = [];
                            pcb();
                        }

                    }
                ],
                function () {
                    deferred.resolve( resultObject );
                }
            );


            return deferred.promise;

        };

        /**
         * Converting object to document
         * This method using $resolved property of passing Resource object.
         *
         * If $resolved == true, it will add _id property of object to result properties
         * of document. If $resolved == true, but _id isn't defined, it will throw an Error.
         *
         * If $resolved == false or not defined, method will ignore _id property even
         * you passed it.
         *
         * @throws Error( 'Missing object' )
         * @throws Error( 'Missing _id property' )
         *
         * @param {object|Resource}     object
         * @param {boolean}             [object.$resolved]
         * @param {string}              [object._id]
         *
         * @return {{}} document
         */
        Lessons.objectToDocument = function ( object ) {

            var resultDocument = {};

            if ( !object )
                throw new Error( 'Missing object' );

            if ( object.$resolved && !object._id )
                throw new Error( 'Missing _id property' );

            if ( object.$resolved )
                resultDocument._id = object._id;

            resultDocument.time = Lessons.getSimpleTimeByExtended( object.time );

            resultDocument.coaches = ApiHelper.depopulateArray( object.coaches );
            resultDocument.halls = ApiHelper.depopulateArray( object.halls );
            resultDocument.groups = ApiHelper.depopulateArray( object.groups );

            return resultDocument;

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

                    resultObject._id = document._id;

                    // time
                    resultObject.time = Lessons.getExtendedTimeBySimple( document.time );

                    // populate arrays
                    async.parallel(
                        [
                            // coaches
                            function ( pcb ) {

                                ApiHelper.populateArray( Coaches, document.coaches )

                                    .then( function ( populatedCoaches ) {
                                        resultObject.coaches = populatedCoaches;
                                    }, function () { //error. nothing to catch!

                                    }, deferred.notify )

                                    .finally( pcb );

                            },

                            // halls
                            function ( pcb ) {

                                ApiHelper.populateArray( Halls, document.halls )

                                    .then( function ( populatedHalls ) {
                                        resultObject.halls = populatedHalls;
                                        pcb();
                                    }, function () { //error. nothing to catch!

                                    }, deferred.notify )

                                    .finally( pcb );

                            },

                            // groups
                            function ( pcb ) {

                                ApiHelper.populateArray( Groups, document.groups )

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

            // time
            try {
                resultDocument.time = Lessons.getSimpleTimeByExtended( data.time );
            } catch ( e ) {
                throw new Error( 'Invalid time' );
            }

            resultDocument.coaches = ApiHelper.depopulateArray( data.coaches );
            resultDocument.halls = ApiHelper.depopulateArray( data.halls );
            resultDocument.groups = ApiHelper.depopulateArray( data.groups );


            Lessons._create( resultDocument ).$promise
                .then( deferred.resolve, deferred.reject );

            return { $promise: deferred.promise };
        };


        /**
         * Update lesson
         *
         * @param {object} params Id of object to upload updates. As default you should pass object with id property to this argument
         * @param {object} object New object to upload
         */
        Lessons.update = function ( params, object ) {
            var deferred = $q.defer(),
                resultDocument = {};

            resultDocument._id = object._id;
            resultDocument.time = Lessons.getSimpleTimeByExtended( object.time );

            resultDocument.coaches = ApiHelper.depopulateArray( object.coaches );
            resultDocument.halls = ApiHelper.depopulateArray( object.halls );
            resultDocument.groups = ApiHelper.depopulateArray( object.groups );

            Lessons._update( params, resultDocument ).$promise
                .then( deferred.resolve, deferred.reject );

            return { $promise: deferred.promise };

        };

        return Lessons;

    } );