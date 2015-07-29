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

        }

        return LessonTimeSimple;

    } )
    .factory( 'LessonTimeExtended' )
    .service( 'LessonTimeTools', function () {

        var LessonTimeTools = this;

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
         * Simple lesson time
         *
         * @typedef {Object} LessonTimeSimple
         *
         * @property {Date} start
         * @property {Date} end
         */

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