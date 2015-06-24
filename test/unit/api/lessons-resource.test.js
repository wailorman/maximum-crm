fdescribe( 'Lessons resource', function () {

    var Lessons;

    beforeEach( module( 'starter.api.lessons' ) );

    beforeEach( inject( function ( _Lessons_ ) {

        Lessons = _Lessons_;

    } ) );

    describe( 'time', function () {

        var simpleTimeObject,
            resultTime;

        describe( '_getExtendedTimeBySimple()', function () {

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
                    expect( resultTime.date.getMonth() ).toEqual( 5-1 );
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

        } );

    } );

} );