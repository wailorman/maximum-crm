angular.module( 'starter.directives.lesson-time-picker', [] )
    .directive( 'lessonTimePicker', function () {

        return {
            restrict: 'E',
            scope: {

            }
        };

    } )
    .controller( 'LessonTimePickerCtrl' )
    .factory( 'LessonTimeSimple', function ( LessonTimeTools ) {

        /**
         * Simple lesson time
         *
         * @typedef {Object} LessonTimeSimple
         *
         * @property {Date} start
         * @property {Date} end
         */

        return LessonTimeTools.LessonTimeSimple;

    } )
    .factory( 'LessonTimeExtended', function ( LessonTimeTools ) {

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

        return LessonTimeTools.LessonTimeExtended;

    } )
    .service( 'LessonTimeTools', function () {

        var LessonTimeTools = this;

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
        LessonTimeTools.LessonTimeExtended = function ( extendedTimeObject ) {

            var date, epochStart, duration;

            if ( !extendedTimeObject )
                throw new InvalidArgumentError( 'Missing time object' );

            if ( !extendedTimeObject.date )
                throw new InvalidArgumentError( 'Invalid time object. Missing date' );

            if ( !extendedTimeObject.epochStart && extendedTimeObject.epochStart !== 0 )
                throw new InvalidArgumentError( 'Invalid time object. Missing epochStart' );

            if ( !extendedTimeObject.duration )
                throw new InvalidArgumentError( 'Invalid time object. Missing duration' );

            // todo: Apply only year, month and date. Even passed something more than
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

        };

        /**
         * Convert instance of extended lesson time to simple time
         *
         * @name LessonTimeExtended#toSimpleTime
         * @returns {LessonTimeTools.LessonTimeSimple}
         */
        LessonTimeTools.LessonTimeExtended.prototype.toSimpleTime = function () {

            var selfExtendedTimeInstance = this,
                resultTime;

            if ( !selfExtendedTimeInstance )
                throw new InvalidArgumentError( 'Not enough params' );

            var date       = selfExtendedTimeInstance.date,
                epochStart = selfExtendedTimeInstance.epochStart,
                duration   = selfExtendedTimeInstance.duration,
                start, end;

            if ( !epochStart ) epochStart = 0;
            if ( !duration ) duration = 0;

            start = new Date( date.getTime() + epochStart * 1000 );
            end   = new Date( start.getTime() + duration * 60 * 1000 );

            resultTime = {
                start: start,
                end: end
            };

            return new LessonTimeTools.LessonTimeSimple( resultTime );

        };

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
        LessonTimeTools.LessonTimeSimple = function ( simpleTimeObject ) {

            var start, end;

            if ( !simpleTimeObject )
                throw new InvalidArgumentError( 'Missing time object' );

            if ( typeof simpleTimeObject != 'object' )
                throw new InvalidArgumentError( 'Invalid time object. Expected object, but got a ' +
                                                typeof simpleTimeObject );

            start = simpleTimeObject.start;
            end   = simpleTimeObject.end;

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
            this.end   = end;

        };

        /**
         * Get extended time object by simple time object
         *
         * @return {LessonTimeTools.LessonTimeExtended} Extended time object
         */
        LessonTimeTools.LessonTimeSimple.prototype.toExtendedTime = function () {

            var selfSimpleTimeInstance = this,
                resultTime,
                date, epochStart, duration,
                durationInMs;

            date = new Date(
                selfSimpleTimeInstance.start.getFullYear(),
                selfSimpleTimeInstance.start.getMonth(),
                selfSimpleTimeInstance.start.getDate()
            );

            epochStart = selfSimpleTimeInstance.start.getHours() * 3600 +
                                    selfSimpleTimeInstance.start.getMinutes();

            durationInMs = selfSimpleTimeInstance.end.getTime() - selfSimpleTimeInstance.start.getTime();

            duration = Math.floor( durationInMs / 1000 / 60 );
            //                                           to minutes
            //                                    to seconds

            resultTime = {
                date: date,
                epochStart: epochStart,
                duration: duration
            };

            return new LessonTimeTools.LessonTimeExtended( resultTime );

        };

        LessonTimeTools.checkEqualityOfTwoTimes = function ( simpleTime, extendedTime ) {

            var extendedTimeInSimple, simpleTimeInUnixtime, extendedTimeInUnixtime;

            if ( !(simpleTime instanceof LessonTimeTools.LessonTimeSimple) )
                throw new InvalidArgumentError(
                    'Invalid simple time object argument. Expecting instance of LessonTimeSimple' );

            if ( !(extendedTime instanceof LessonTimeTools.LessonTimeExtended) )
                throw new InvalidArgumentError(
                    'Invalid extended time object argument. Expecting instance of LessonTimeExtended' );

            extendedTimeInSimple = extendedTime.toSimpleTime();

            simpleTimeInUnixtime = {
                start: simpleTime.start.getTime(),
                end: simpleTime.end.getTime()
            };

            extendedTimeInUnixtime = {
                start: extendedTimeInSimple.start.getTime(),
                end: extendedTimeInSimple.end.getTime()
            };

            return simpleTimeInUnixtime.start == extendedTimeInUnixtime.start &&
                   simpleTimeInUnixtime.end == extendedTimeInUnixtime.end;


        };

        LessonTimeTools.LessonTimeSimple.prototype.isEqualToExtendedTime = function ( extendedTime ) {


        };

    } );