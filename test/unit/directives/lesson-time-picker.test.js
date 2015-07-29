describe( 'lesson-time-picker directive', function () {

    beforeEach( module( 'starter.directives.lesson-time-picker' ) );

    var LessonTimeTools,
        LessonTimeSimple;

    beforeEach( inject( function ( _LessonTimeTools_, _LessonTimeSimple_, _LessonTimeExtended_ ) {

        LessonTimeTools  = _LessonTimeTools_;
        LessonTimeSimple = _LessonTimeSimple_;

    } ) );

    describe( 'LessonTimeTools', function () {

        describe( 'getExtendedTimeBySimple()', function () {

            var getExtendedTimeBySimple,
                simpleTimeObject,
                resultTime;

            beforeEach( function () {

                getExtendedTimeBySimple = LessonTimeTools.getExtendedTimeBySimple;

                simpleTimeObject = {
                    start: new Date( 2015, 5 - 1, 8, 14, 0 ),
                    end: new Date( 2015, 5 - 1, 8, 14, 30 )
                };

                resultTime = getExtendedTimeBySimple( simpleTimeObject );

            } );

            it( 'should return simple time object data with extended', function () {

                expect( resultTime.start.getTime() ).toEqual( simpleTimeObject.start.getTime() );
                expect( resultTime.end.getTime() ).toEqual( simpleTimeObject.end.getTime() );

            } );

            describe( 'date', function () {

                it( 'should return correct date', function () {

                    expect( resultTime.date.getFullYear() ).toEqual( 2015 );
                    expect( resultTime.date.getMonth() ).toEqual( 5 - 1 );
                    expect( resultTime.date.getDate() ).toEqual( 8 );

                } );

                it( 'should get date property from time.start if lesson stretching for 2 days', function () {

                    simpleTimeObject = {
                        start: new Date( 2015, 5 - 1, 8, 23, 0 ),
                        end: new Date( 2015, 5 - 1, 9, 0, 30 )
                    };

                    resultTime = getExtendedTimeBySimple( simpleTimeObject );

                } );

            } );

            describe( 'epochStart', function () {

                it( 'should return 50400 for 14:00', function () {

                    expect( resultTime.epochStart ).toEqual( 50400 );

                } );

                it( 'should return 0 if lesson starts at 00:00', function () {

                    simpleTimeObject = {
                        start: new Date( 2015, 5 - 1, 8, 0, 0 ),
                        end: new Date( 2015, 5 - 1, 8, 0, 30 )
                    };

                    resultTime = getExtendedTimeBySimple( simpleTimeObject );

                    expect( resultTime.epochStart ).toEqual( 0 );

                } );

            } );

            describe( 'duration', function () {

                it( 'should return 0 if lesson ends when it starts', function () {

                    simpleTimeObject = {
                        start: new Date( 2015, 5 - 1, 8, 1, 0 ),
                        end: new Date( 2015, 5 - 1, 8, 1, 0 )
                    };

                    resultTime = getExtendedTimeBySimple( simpleTimeObject );

                    expect( resultTime.duration ).toEqual( 0 );

                } );

                it( 'should return 30 if lesson starts at 14:00 and ends at 14:30', function () {

                    simpleTimeObject = {
                        start: new Date( 2015, 5 - 1, 8, 14, 0 ),
                        end: new Date( 2015, 5 - 1, 8, 14, 30 )
                    };

                    resultTime = getExtendedTimeBySimple( simpleTimeObject );

                    expect( resultTime.duration ).toEqual( 30 );

                } );

                it( 'should return 60 if lesson starts at 23:30 and ends at 0:30 on the next day', function () {

                    simpleTimeObject = {
                        start: new Date( 2015, 5 - 1, 8, 23, 30 ),
                        end: new Date( 2015, 5 - 1, 9, 0, 30 )
                    };

                    resultTime = getExtendedTimeBySimple( simpleTimeObject );

                    expect( resultTime.duration ).toEqual( 60 );

                } );

            } );

            it( 'should throw exception if we passing not date to args', function () {

                var invalidTimeObject;

                invalidTimeObject = {
                    time: {
                        start: new Date( 2015, 5 - 1, 8, 14, 0 ),
                        end: 100
                    }
                };

                expect( function () {
                    getExtendedTimeBySimple( invalidTimeObject );
                } ).toThrow();

                /////////////////////////////////////////////////

                invalidTimeObject = {
                    time: {
                        start: 100,
                        end: new Date( 2015, 5 - 1, 8, 14, 30 )
                    }
                };

                expect( function () {
                    getExtendedTimeBySimple( invalidTimeObject );
                } ).toThrow();

                /////////////////////////////////////////////////

                invalidTimeObject = {
                    time: {
                        start: 100,
                        end: 100
                    }
                };

                expect( function () {
                    getExtendedTimeBySimple( invalidTimeObject );
                } ).toThrow();

            } );

        } );

        describe( 'getSimpleTimeByExtended()', function () {

            var extendedTimeObject = {},
                resultTime,
                getSimpleTimeByExtended;

            beforeEach( function () {

                getSimpleTimeByExtended = LessonTimeTools.getSimpleTimeByExtended;

                extendedTimeObject = {
                    date: new Date( 2015, 5 - 1, 8 ),
                    epochStart: 50400, // 14:00
                    duration: 30 // minutes
                };

                resultTime = getSimpleTimeByExtended( extendedTimeObject );

            } );

            describe( 'time.start', function () {

                it( 'time.start should be 8/5/2015 14:00', function () {

                    expect( resultTime.start.getFullYear() ).toEqual( 2015 );
                    expect( resultTime.start.getMonth() ).toEqual( 5 - 1 );
                    expect( resultTime.start.getDate() ).toEqual( 8 );
                    expect( resultTime.start.getHours() ).toEqual( 14 );
                    expect( resultTime.start.getMinutes() ).toEqual( 0 );

                } );

                it( 'should works fine if epochStart >86400 (out of 24 hrs range)', function () {

                    extendedTimeObject = {
                        date: new Date( 2015, 5 - 1, 8 ),
                        epochStart: 90000, // 1:00 of the next day
                        duration: 30 // minutes
                    };

                    resultTime = getSimpleTimeByExtended( extendedTimeObject );

                    expect( resultTime.start.getFullYear() ).toEqual( 2015 );
                    expect( resultTime.start.getMonth() ).toEqual( 5 - 1 );
                    expect( resultTime.start.getDate() ).toEqual( 9 );
                    expect( resultTime.start.getHours() ).toEqual( 1 );
                    expect( resultTime.start.getMinutes() ).toEqual( 0 );

                } );

                it( 'should works fine if epochStart=0', function () {

                    extendedTimeObject = {
                        date: new Date( 2015, 5 - 1, 8 ),
                        epochStart: 0, // 00:00
                        duration: 30 // minutes
                    };

                    resultTime = getSimpleTimeByExtended( extendedTimeObject );

                    expect( resultTime.start.getFullYear() ).toEqual( 2015 );
                    expect( resultTime.start.getMonth() ).toEqual( 5 - 1 );
                    expect( resultTime.start.getDate() ).toEqual( 8 );
                    expect( resultTime.start.getHours() ).toEqual( 0 );
                    expect( resultTime.start.getMinutes() ).toEqual( 0 );

                } );

                it( 'should throw exception if extendedTime is null', function () {

                    extendedTimeObject = null;

                    expect(
                        function () {
                            getSimpleTimeByExtended( extendedTimeObject );
                        }
                    ).toThrow( new InvalidArgumentError( "Not enough params" ) );

                } );

            } );

            describe( 'time.end', function () {

                it( 'time.end should be 8/5/2015 14:30', function () {

                    expect( resultTime.end.getFullYear() ).toEqual( 2015 );
                    expect( resultTime.end.getMonth() ).toEqual( 5 - 1 );
                    expect( resultTime.end.getDate() ).toEqual( 8 );
                    expect( resultTime.end.getHours() ).toEqual( 14 );
                    expect( resultTime.end.getMinutes() ).toEqual( 30 );

                } );

                it( 'should works fine if lesson duration is longer than a day (>1440 mins)', function () {

                    extendedTimeObject = {
                        date: new Date( 2015, 5 - 1, 8 ),
                        epochStart: 50400, // 14:00
                        duration: 1500 // 1 day + 1 hour
                    };

                    resultTime = getSimpleTimeByExtended( extendedTimeObject );

                    expect( resultTime.end.getFullYear() ).toEqual( 2015 );
                    expect( resultTime.end.getMonth() ).toEqual( 5 - 1 );
                    expect( resultTime.end.getDate() ).toEqual( 9 );
                    expect( resultTime.end.getHours() ).toEqual( 15 );
                    expect( resultTime.end.getMinutes() ).toEqual( 0 );

                } );

                it( 'should works fine if duration=0', function () {

                    extendedTimeObject = {
                        date: new Date( 2015, 5 - 1, 8 ),
                        epochStart: 50400, // 14:00
                        duration: 0
                    };

                    resultTime = getSimpleTimeByExtended( extendedTimeObject );

                    expect( resultTime.end.getFullYear() ).toEqual( 2015 );
                    expect( resultTime.end.getMonth() ).toEqual( 5 - 1 );
                    expect( resultTime.end.getDate() ).toEqual( 8 );
                    expect( resultTime.end.getHours() ).toEqual( 14 );
                    expect( resultTime.end.getMinutes() ).toEqual( 0 );

                } );

            } );

            it( 'should throw exception if extended time is null', function () {

                extendedTimeObject = {};

                expect(
                    function () {
                        getSimpleTimeByExtended( extendedTimeObject );
                    }
                ).toThrow( new Error( "Not enough params (date missing)" ) );

            } );

            it( 'should throw exception if date is not Date', function () {

                var invalidTimeObject = {
                    date: 100,
                    epochStart: 50400,
                    duration: 30
                };

                expect( function () {
                    getSimpleTimeByExtended( invalidTimeObject );
                } ).toThrow( new InvalidArgumentError('date property should be instance of Date') );

            } );

            it( 'should throw exception if epochStart is not number', function () {

                var invalidTimeObject = {
                    date: new Date( 2015, 5-1, 8 ),
                    epochStart: '50400',
                    duration: 30
                };

                expect( function () {
                    getSimpleTimeByExtended( invalidTimeObject );
                } ).toThrow( new InvalidArgumentError('epochStart property should be number') );

            } );

            it( 'should throw exception if duration is not number', function () {

                var invalidTimeObject = {
                    date: new Date( 2015, 5-1, 8 ),
                    epochStart: 50400,
                    duration: '30'
                };

                expect( function () {
                    getSimpleTimeByExtended( invalidTimeObject );
                } ).toThrow( new InvalidArgumentError('duration property should be number') );

            } );

        } );

    } );

    describe( 'LessonTimeSimple', function () {

        var simpleTime,
            constructingSimpleTime,
            constructedLessonTimeSimple;

        beforeEach( function () {

            simpleTime = {
                start: new Date( 2015, 5 - 1, 8, 14, 0 ),
                end: new Date( 2015, 5 - 1, 8, 14, 30 )
            };

            constructingSimpleTime = function () {
                constructedLessonTimeSimple = new LessonTimeSimple( simpleTime );
            };

        } );

        describe( 'constructor', function () {

            it( 'should successfully construct valid simple time object', function () {

                expect( constructingSimpleTime ).not.toThrow();

            } );

            it( 'should throw error if time object is not undefined', function () {

                simpleTime = undefined;

                expect( constructingSimpleTime ).toThrow( new InvalidArgumentError( 'Missing time object' ) );

            } );

            it( 'should throw error if time object is not object', function () {

                simpleTime = 'some text';

                expect( constructingSimpleTime ).toThrow(
                    new InvalidArgumentError( 'Invalid time object. Expected object, but got a string' )
                );


                simpleTime = 123;

                expect( constructingSimpleTime ).toThrow(
                    new InvalidArgumentError( 'Invalid time object. Expected object, but got a number' )
                );

            } );

            it( 'should throw error if start property is not defined', function () {

                delete simpleTime.start;

                expect( constructingSimpleTime ).toThrow(
                    new InvalidArgumentError( 'Invalid time object. Missing start property' )
                );

            } );

            it( 'should throw error if end property is not defined', function () {

                delete simpleTime.end;

                expect( constructingSimpleTime ).toThrow(
                    new InvalidArgumentError( 'Invalid time object. Missing end property' )
                );

            } );

            it( 'should throw error if .start is not Date', function () {

                simpleTime.start = 123;

                expect( constructingSimpleTime ).toThrow(
                    new InvalidArgumentError( 'Invalid time object. start property should be instance of Date' )
                );

            } );

            it( 'should throw error if .end is not Date', function () {

                simpleTime.end = 123;

                expect( constructingSimpleTime ).toThrow(
                    new InvalidArgumentError( 'Invalid time object. end property should be instance of Date' )
                );

            } );

            it( 'should throw error if end time is earlier than start', function () {

                simpleTime.end.setHours( 0 );

                expect( constructingSimpleTime ).toThrow(
                    new InvalidArgumentError( 'Invalid time object. end time should be greater than start' )
                );

            } );

            it( 'should throw error if start is equal to end', function () {

                simpleTime.end = simpleTime.start;

                expect( constructingSimpleTime ).toThrow(
                    new InvalidArgumentError( 'Invalid time object. end time should be greater than start' )
                );

            } );

        } );

    } );
} );