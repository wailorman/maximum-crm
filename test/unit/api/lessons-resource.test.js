describe( 'Lessons resource', function () {

    var Lessons;

    beforeEach( module( 'starter.api.lessons' ) );

    beforeEach( inject( function ( _Lessons_ ) {

        Lessons = _Lessons_;

    } ) );

    describe( 'time', function () {

        var simpleTimeObject,
            resultTime;

        describe( 'getExtendedTimeBySimple()', function () {

            beforeEach( function () {

                simpleTimeObject = {
                    start: new Date( 2015, 5 - 1, 8, 14, 0 ),
                    end: new Date( 2015, 5 - 1, 8, 14, 30 )
                };

                resultTime = Lessons.getExtendedTimeBySimple( simpleTimeObject );

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

                    resultTime = Lessons.getExtendedTimeBySimple( simpleTimeObject );

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

                    resultTime = Lessons.getExtendedTimeBySimple( simpleTimeObject );

                    expect( resultTime.epochStart ).toEqual( 0 );

                } );

            } );

            describe( 'duration', function () {

                it( 'should return 0 if lesson ends when it starts', function () {

                    simpleTimeObject = {
                        start: new Date( 2015, 5 - 1, 8, 1, 0 ),
                        end: new Date( 2015, 5 - 1, 8, 1, 0 )
                    };

                    resultTime = Lessons.getExtendedTimeBySimple( simpleTimeObject );

                    expect( resultTime.duration ).toEqual( 0 );

                } );

                it( 'should return 30 if lesson starts at 14:00 and ends at 14:30', function () {

                    simpleTimeObject = {
                        start: new Date( 2015, 5 - 1, 8, 14, 0 ),
                        end: new Date( 2015, 5 - 1, 8, 14, 30 )
                    };

                    resultTime = Lessons.getExtendedTimeBySimple( simpleTimeObject );

                    expect( resultTime.duration ).toEqual( 30 );

                } );

                it( 'should return 60 if lesson starts at 23:30 and ends at 0:30 on the next day', function () {

                    simpleTimeObject = {
                        start: new Date( 2015, 5 - 1, 8, 23, 30 ),
                        end: new Date( 2015, 5 - 1, 9, 0, 30 )
                    };

                    resultTime = Lessons.getExtendedTimeBySimple( simpleTimeObject );

                    expect( resultTime.duration ).toEqual( 60 );

                } );

            } );

        } );

        describe( 'getSimpleTimeByExtended()', function () {

            var extendedTimeObject = {},
                resultTime;

            beforeEach( function () {

                extendedTimeObject = {
                    date: new Date( 2015, 5-1, 8 ),
                    epochStart: 50400, // 14:00
                    duration: 30 // minutes
                };

                resultTime = Lessons.getSimpleTimeByExtended( extendedTimeObject );

            } );

            describe( 'time.start', function () {

                it( 'should calculate time.start correctly', function () {

                    expect( resultTime.start.getFullYear() ).toEqual( 2015 );
                    expect( resultTime.start.getMonth() ).toEqual( 5-1 );
                    expect( resultTime.start.getDate() ).toEqual( 8 );
                    expect( resultTime.start.getHours() ).toEqual( 14 );
                    expect( resultTime.start.getMinutes() ).toEqual( 0 );

                } );

                it( 'should works fine if epochStart >86400 (go to another day)', function () {

                    extendedTimeObject = {
                        date: new Date( 2015, 5-1, 8 ),
                        epochStart: 90000, // 1:00 of the next day
                        duration: 30 // minutes
                    };

                    resultTime = Lessons.getSimpleTimeByExtended( extendedTimeObject );

                    expect( resultTime.start.getFullYear() ).toEqual( 2015 );
                    expect( resultTime.start.getMonth() ).toEqual( 5-1 );
                    expect( resultTime.start.getDate() ).toEqual( 9 );
                    expect( resultTime.start.getHours() ).toEqual( 1 );
                    expect( resultTime.start.getMinutes() ).toEqual( 0 );

                } );

            } );

            describe( 'time.end', function () {

                it( 'should calculate time.end correctly', function () {

                    expect( resultTime.end.getFullYear() ).toEqual( 2015 );
                    expect( resultTime.end.getMonth() ).toEqual( 5-1 );
                    expect( resultTime.end.getDate() ).toEqual( 8 );
                    expect( resultTime.end.getHours() ).toEqual( 14 );
                    expect( resultTime.end.getMinutes() ).toEqual( 30 );

                } );

                it( 'should works fine if lesson duration is longer than a day (>1440)', function () {

                    extendedTimeObject = {
                        date: new Date( 2015, 5-1, 8 ),
                        epochStart: 50400, // 14:00
                        duration: 1500 // 1 day + 1 hour
                    };

                    resultTime = Lessons.getSimpleTimeByExtended( extendedTimeObject );

                    expect( resultTime.end.getFullYear() ).toEqual( 2015 );
                    expect( resultTime.end.getMonth() ).toEqual( 5-1 );
                    expect( resultTime.end.getDate() ).toEqual( 9 );
                    expect( resultTime.end.getHours() ).toEqual( 15 );
                    expect( resultTime.end.getMinutes() ).toEqual( 0 );

                } );

            } );

        } );

    } );

} );