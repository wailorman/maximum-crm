angular.module( 'starter.api.lessons', [

    'starter.api.helper',

    'starter.api.interceptors',
    
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
         * Lesson document
         *
         * @typedef {Object} LessonDocument
         *
         * @property {string} _id
         * @property {LessonTimeSimple} time
         * @property {Array.<string>} coaches
         * @property {Array.<string>} halls
         * @property {Array.<string>} groups
         * @property {boolean} [$resolved]
         */

        /**
         * Lesson object
         *
         * @typedef {Object} LessonObject
         *
         * @property {string} _id
         * @property {LessonTimeExtended} time
         * @property {Array.<Object>} coaches
         * @property {Array.<Object>} halls
         * @property {Array.<Object>} groups
         * @property {boolean} [$resolved]
         */


        /**
         * Extended lesson time
         *
         * @typedef {Object} LessonTimeExtended
         *
         * @property {Date} date            Date in which lessons is starting (only year, month and day)
         * @property {number} epochStart    Seconds from start of day to start of lesson
         * @property {number} duration      Duration of lesson (in minutes)
         * @property {Date} start           Start time from source simple time
         * @property {Date} end             End time from source simple time
         */

        /**
         * Get extended time object by simple time object
         *
         * @param {LessonTimeSimple} timeObject
         *
         * @throws {InvalidArgumentError} Not enough params
         * @throws {InvalidArgumentError} Invalid time object. start or end property are not instance of Date
         *
         * @return {LessonTimeExtended|*} Extended time object
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
         * Extended lesson time
         *
         * @typedef {Object} LessonTimeSimple
         *
         * @property {Date} start
         * @property {Date} end
         */

        /**
         * Get extended time object by simple time object
         *
         * @param {LessonTimeExtended}  timeObject
         *
         * @throws {InvalidArgumentError} Not enough params (date missing)
         * @throws {InvalidArgumentError} date property should be instance of Date
         * @throws {InvalidArgumentError} epochStart property should be number
         * @throws {InvalidArgumentError} duration property should be number
         *
         * @return {LessonTimeSimple|*} Simple time object
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
         * @throws see {@link Lessons.getExtendedTimeBySimple}
         * @throws {InvalidArgumentError} Missing document
         * @throws {InvalidArgumentError} Missing time.start property in document
         * @throws {InvalidArgumentError} Missing time.end property in document
         * @throws {InvalidArgumentError} Missing time property in document
         *
         * @param {LessonDocument} document
         *
         * @return {Promise.<LessonObject,,HttpError>|*}
         * Resolve converted object.
         * Notice every time when {@link populateArray} can't find some objects from array.
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
                    throw new InvalidArgumentError( 'Missing time.start property in document' );

                if ( !document.time.end )
                    throw new InvalidArgumentError( 'Missing time.end property in document' );

            } else
                throw new InvalidArgumentError( 'Missing time property in document' );


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
         * @todo Think about getting rid of checking _id together with $resolved because it is not critical. Resource#get caring about it (maybe)
         *
         * @throws {InvalidArgumentError} Missing object
         * @throws {InvalidArgumentError} Missing _id property
         *
         * @param {LessonObject}        object
         *
         * @return {LessonDocument|*} document
         */
        Lessons.objectToDocument = function ( object ) {

            var resultDocument = {};

            if ( !object )
                throw new InvalidArgumentError( 'Missing object' );

            if ( object.$resolved && !object._id )
                throw new InvalidArgumentError( 'Missing _id property' );

            if ( object.$resolved )
                resultDocument._id = object._id;

            resultDocument.time = Lessons.getSimpleTimeByExtended( object.time );

            resultDocument.coaches = ApiHelper.depopulateArray( object.coaches );
            resultDocument.halls = ApiHelper.depopulateArray( object.halls );
            resultDocument.groups = ApiHelper.depopulateArray( object.groups );

            return resultDocument;

        };

        return Lessons;

    } );