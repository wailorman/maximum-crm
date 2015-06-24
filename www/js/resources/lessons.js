angular.module( 'starter.api.lessons', [
    'ngResource'
] )
    .factory( 'Lessons', function ( $resource ) {

        var apiUrl = 'http://api.max-crm.wailorman.ru:21080';

        var Lessons = $resource( apiUrl + '/lessons/:id', null, {

            '_get': { method: 'GET', timeout: 5000 },
            '_query': { method: 'GET', isArray: true, timeout: 5000 },
            'update': { method: 'PUT', timeout: 5000 },
            'create': { method: 'POST', timeout: 5000 },
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
         * @param {Number}  timeObject.epochStart
         * @param {Number}  [timeObject.duration]
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

        return Lessons;

    } );