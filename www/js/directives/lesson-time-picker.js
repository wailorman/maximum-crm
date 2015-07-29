angular.module( 'starter.directives.lesson-time-picker', [] )
    .directive( 'lessonTimePicker', function () {

        return {
            restrict: 'E',
            scope: {

            }
        };

    } )
    .controller( 'LessonTimePickerCtrl' )
    .factory( 'LessonTimeSimple', function () {

        /**
         * Simple lesson time
         *
         * @typedef {Object} LessonTimeSimple
         *
         * @property {Date} start
         * @property {Date} end
         */

        /**
         * @class LessonTimeSimple
         *
         * @param {object} simpleTimeObject
         * @param {Date} simpleTimeObject.start
         * @param {Date} simpleTimeObject.end
         *
         * @throws {InvalidArgumentError} Missing time object
         * @throws {InvalidArgumentError} Invalid time object. Expected object, but got a ...
         * @throws {InvalidArgumentError} Invalid time object. Missing start property
         * @throws {InvalidArgumentError} Invalid time object. Missing end property
         * @throws {InvalidArgumentError} Invalid time object. start property should be instance of Date
         * @throws {InvalidArgumentError} Invalid time object. end property should be instance of Date
         * @throws {InvalidArgumentError} Invalid time object. end time should be greater than start
         *
         * @constructor
         */
        function LessonTimeSimple( simpleTimeObject ) {

            var start, end;

            if ( !simpleTimeObject )
                throw new InvalidArgumentError( 'Missing time object' );

            if ( typeof simpleTimeObject != 'object' )
                throw new InvalidArgumentError( 'Invalid time object. Expected object, but got a ' +
                                                typeof simpleTimeObject );

            start = simpleTimeObject.start;
            end = simpleTimeObject.end;

            if ( !start )
                throw new InvalidArgumentError( 'Invalid time object. Missing start property' );

            if ( !end )
                throw new InvalidArgumentError( 'Invalid time object. Missing end property' );

            if ( !(start instanceof Date) )
                throw new InvalidArgumentError( 'Invalid time object. start property should be instance of Date' );

            if ( !(end instanceof Date) )
                throw new InvalidArgumentError( 'Invalid time object. end property should be instance of Date' );

            if ( start.getTime() >= end.getTime() )
                throw new InvalidArgumentError( 'Invalid time object. end time should be greater than start' );

            this.start = start;
            this.end = end;

        }

        return LessonTimeSimple;

    } )
    .factory( 'LessonTimeExtended', function () {

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
         * @class LessonTimeExtended
         *
         * @param {object} extendedTimeObject
         *
         * @param {Date} extendedTimeObject.date            Date of Lesson.
         *
         * @param {number} extendedTimeObject.epochStart    Number of seconds from start of a day (date).
         * Should be less than 86400
         *
         * @param {number} extendedTimeObject.duration      Lesson duration in minutes
         * Should be equal or greater than 1
         *
         * @throws {InvalidArgumentError} Invalid time object. Missing date
         * @throws {InvalidArgumentError} Invalid time object. Missing epochStart
         * @throws {InvalidArgumentError} Invalid time object. Missing duration
         * @throws {InvalidArgumentError} Invalid time object. Expected date as object, but got a ...
         * @throws {InvalidArgumentError} Invalid time object. Expected date as instance of Date
         * @throws {InvalidArgumentError} Invalid time object. Expected epochStart as number, but got a ...
         * @throws {InvalidArgumentError} Invalid time object. Lesson Can\'t starts on the next day after .date (epochStart is >86399)
         * @throws {InvalidArgumentError} Invalid time object. Expected duration as number, but got a ...
         * @throws {InvalidArgumentError} Invalid time object. Lesson should go on no less than 1 minute
         *
         * @constructor
         */
        function LessonTimeExtended( extendedTimeObject ) {

            var date, epochStart, duration;

            if ( !extendedTimeObject.date )
                throw new InvalidArgumentError( 'Invalid time object. Missing date' );

            if ( !extendedTimeObject.epochStart )
                throw new InvalidArgumentError( 'Invalid time object. Missing epochStart' );

            if ( !extendedTimeObject.duration )
                throw new InvalidArgumentError( 'Invalid time object. Missing duration' );

            date       = extendedTimeObject.date;
            epochStart = extendedTimeObject.epochStart;
            duration   = extendedTimeObject.duration;

            if ( typeof date != 'object' )
                throw new InvalidArgumentError( 'Invalid time object. Expected date as object, but got a ' +
                                                typeof date );

            if ( !( date instanceof Date ) )
                throw new InvalidArgumentError( 'Invalid time object. Expected date as instance of Date' );

            /////////////////////////////

            if ( typeof epochStart != 'number' )
                throw new InvalidArgumentError( 'Invalid time object. Expected epochStart as number, but got a ' +
                                                typeof epochStart );

            if ( epochStart > 86399 )
                throw new InvalidArgumentError(
                    'Invalid time object. Lesson Can\'t starts on the next day after .date (epochStart is >86399)' );

            /////////////////////////////

            if ( typeof duration != 'number' )
                throw new InvalidArgumentError(
                    'Invalid time object. Expected duration as number, but got a ' + typeof duration );

            if ( duration < 1 )
                throw new InvalidArgumentError( 'Invalid time object. Lesson should go on no less than 1 minute' );

            /////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////

            this.date = date;
            this.epochStart = epochStart;
            this.duration = duration;

        }

        return LessonTimeExtended;

    } )
    .service( 'LessonTimeTools', function () {

        var LessonTimeTools = this;

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
        LessonTimeTools.getExtendedTimeBySimple = function ( timeObject ) {
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
         * @todo Add functionality to work with passed LessonTimeSimple instead of LessonTimeExtended to timeObject arg
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
        LessonTimeTools.getSimpleTimeByExtended = function ( timeObject ) {

            var resultTime = {};

            if ( !timeObject )
                throw new InvalidArgumentError( 'Not enough params' );

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

    } );