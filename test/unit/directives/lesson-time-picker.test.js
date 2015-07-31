describe( 'lesson-time-picker directive', function () {

    beforeEach( module( 'starter.directives.lesson-time-picker' ) );

    var LessonTimeTools,
        LessonTimeSimple,
        LessonTimeExtended;

    beforeEach( inject( function ( _LessonTimeTools_, _LessonTimeSimple_, _LessonTimeExtended_ ) {

        LessonTimeTools  = _LessonTimeTools_;
        LessonTimeSimple = _LessonTimeSimple_;
        LessonTimeExtended = _LessonTimeExtended_;

    } ) );

    describe( 'LessonTimeTools', function () {

        describe( 'checkEqualityOfTwoTimes()', function () {

            var simpleTime, extendedTime, checkEquality;

            beforeEach( function () {

                simpleTime = new LessonTimeSimple( {
                    start: new Date( 2015, 5 - 1, 8, 14, 0 ),
                    end: new Date( 2015, 5 - 1, 8, 14, 30 )
                } );

                extendedTime = new LessonTimeExtended( {
                    date: new Date( 2015, 5 - 1, 8 ),
                    epochStart: 14 * 3600,
                    duration: 30
                } );

                checkEquality = function () {
                    return LessonTimeTools.checkEqualityOfTwoTimes( simpleTime, extendedTime )
                };

            } );

            it( 'should be equal', function () {

                expect( checkEquality() ).toBeTruthy();

            } );

            it( 'should throw error if passing simple object to simpleTime arg', function () {

                simpleTime = {
                    start: new Date(),
                    end: new Date()
                };

                expect( function () {

                    checkEquality();

                } ).toThrow( new InvalidArgumentError(
                    'Invalid simple time object argument. Expecting instance of LessonTimeSimple' ) );

            } );

            it( 'should throw error if passing simple object to extendedTime arg', function () {

                extendedTime = {
                    date: new Date(),
                    epochStart: 0,
                    duration: 0
                };

                expect( function () {

                    checkEquality();

                } ).toThrow( new InvalidArgumentError(
                    'Invalid extended time object argument. Expecting instance of LessonTimeExtended' ) );

            } );

            describe( 'should be not equal', function () {

                it( 'by date', function () {

                    extendedTime = new LessonTimeExtended( {
                        date: new Date( 2015, 5 - 1, 9 ),
                        epochStart: 14 * 3600,
                        duration: 30
                    } );

                    expect( checkEquality() ).toBeFalsy();

                } );

                it( 'by epochStart', function () {

                    extendedTime = new LessonTimeExtended( {
                        date: new Date( 2015, 5 - 1, 8 ),
                        epochStart: 15 * 3600,
                        duration: 30
                    } );

                    expect( checkEquality() ).toBeFalsy();

                } );

                it( 'by duration', function () {

                    extendedTime = new LessonTimeExtended( {
                        date: new Date( 2015, 5 - 1, 8 ),
                        epochStart: 14 * 3600,
                        duration: 31
                    } );

                    expect( checkEquality() ).toBeFalsy();

                } );

            } );

        } );

    } );

    describe( 'LessonTimeSimple', function () {

        var simpleTime; // clear example of simple time object

        beforeEach( function () {

            simpleTime = {
                start: new Date( 2015, 5 - 1, 8, 14, 0 ),
                end: new Date( 2015, 5 - 1, 8, 14, 30 )
            };

        } );

        describe( 'constructor', function () {

            var constructingSimpleTime,
                constructedLessonTimeSimple;

            beforeEach( function () {

                constructingSimpleTime = function () {
                    constructedLessonTimeSimple = new LessonTimeSimple( simpleTime );
                };

            } );

            it( 'should successfully construct valid simple time object', function () {

                expect( constructingSimpleTime ).not.toThrow();

            } );

            describe( 'should throw error if', function () {

                it( 'time object is not undefined', function () {

                    simpleTime = undefined;

                    expect( constructingSimpleTime ).toThrow( new InvalidArgumentError( 'Missing time object' ) );

                } );

                it( 'time object is not object', function () {

                    simpleTime = 'some text';

                    expect( constructingSimpleTime ).toThrow(
                        new InvalidArgumentError( 'Invalid time object. Expected object, but got a string' )
                    );


                    simpleTime = 123;

                    expect( constructingSimpleTime ).toThrow(
                        new InvalidArgumentError( 'Invalid time object. Expected object, but got a number' )
                    );

                } );

                it( 'start property is not defined', function () {

                    delete simpleTime.start;

                    expect( constructingSimpleTime ).toThrow(
                        new InvalidArgumentError( 'Invalid time object. Missing start property' )
                    );

                } );

                it( 'end property is not defined', function () {

                    delete simpleTime.end;

                    expect( constructingSimpleTime ).toThrow(
                        new InvalidArgumentError( 'Invalid time object. Missing end property' )
                    );

                } );

                it( '.start is not Date', function () {

                    simpleTime.start = 123;

                    expect( constructingSimpleTime ).toThrow(
                        new InvalidArgumentError( 'Invalid time object. start property should be instance of Date' )
                    );

                } );

                it( '.end is not Date', function () {

                    simpleTime.end = 123;

                    expect( constructingSimpleTime ).toThrow(
                        new InvalidArgumentError( 'Invalid time object. end property should be instance of Date' )
                    );

                } );

                it( 'end time is earlier than start', function () {

                    simpleTime.end.setHours( 0 );

                    expect( constructingSimpleTime ).toThrow(
                        new InvalidArgumentError( 'Invalid time object. end time should be greater than start' )
                    );

                } );

                it( 'start is equal to end', function () {

                    simpleTime.end = simpleTime.start;

                    expect( constructingSimpleTime ).toThrow(
                        new InvalidArgumentError( 'Invalid time object. end time should be greater than start' )
                    );

                } );

            } );

            describe( 'should have', function () {

                beforeEach( function () {
                    constructingSimpleTime();
                } );

                it( 'start', function () {

                    expect( constructedLessonTimeSimple.start.getTime() ).toEqual( simpleTime.start.getTime() );

                } );

                it( 'end', function () {

                    expect( constructedLessonTimeSimple.end.getTime() ).toEqual( simpleTime.end.getTime() );

                } );

            } );

        } );

        describe( 'toExtendedTime()', function () {

            var getExtendedTimeBySimple,
                simpleTimeObject,
                resultTime;

            beforeEach( function () {

                getExtendedTimeBySimple = function ( simpleTimeObject ) {

                    return (new LessonTimeSimple( simpleTimeObject )).toExtendedTime();

                };

                simpleTimeObject = {
                    start: new Date( 2015, 5 - 1, 8, 14, 0 ),
                    end: new Date( 2015, 5 - 1, 8, 14, 30 )
                };

                resultTime = getExtendedTimeBySimple( simpleTimeObject );

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

                    expect( resultTime.date.getFullYear() ).toEqual( 2015 );
                    expect( resultTime.date.getMonth() ).toEqual( 5 - 1 );
                    expect( resultTime.date.getDate() ).toEqual( 8 );

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

        } );

        describe( 'isEqualToExtendedTime()', function () {

            var simpleTime, extendedTime;

            beforeEach( function () {

                simpleTime = new LessonTimeSimple( {
                    start: new Date( 2015, 5 - 1, 8, 14, 0 ),
                    end: new Date( 2015, 5 - 1, 8, 14, 30 )
                } );

                extendedTime = new LessonTimeExtended( {
                    date: new Date( 2015, 5 - 1, 8 ),
                    epochStart: 14 * 3600,
                    duration: 30
                } );

            } );

            it( 'should be equal', function () {

                expect( simpleTime.isEqualToExtendedTime( extendedTime ) ).toBeTruthy();

            } );

            it( 'should be not equal', function () {

                extendedTime = new LessonTimeExtended( {
                    date: new Date( 2015, 5 - 1, 8 ),
                    epochStart: 14 * 3600,
                    duration: 31
                } );


                expect( simpleTime.isEqualToExtendedTime( extendedTime ) ).toBeFalsy();

            } );

        } );

    } );

    describe( 'LessonTimeExtended', function () {

        var extendedTime; // clear example of extended time object

        beforeEach( function () {

            extendedTime = {
                date: new Date( 2015, 5 - 1, 8 ),
                epochStart: 14 * 3600,
                duration: 30
            };

        } );

        describe( 'constructor', function () {

            var constructingExtendedTime,
                constructedLessonTimeExtended;

            beforeEach( function () {

                constructingExtendedTime = function () {
                    constructedLessonTimeExtended = new LessonTimeExtended( extendedTime );
                };

            } );

            it( 'should successfully construct valid simple time object', function () {

                expect( constructingExtendedTime ).not.toThrow();

            } );

            it( 'should throw error if time object is not defined', function () {

                extendedTime = undefined;

                expect( constructingExtendedTime )
                    .toThrow( new InvalidArgumentError( 'Missing time object' ) );

            } );

            describe( 'should throw error if .date', function () {

                it( 'not defined', function () {

                    delete extendedTime.date;

                    expect( constructingExtendedTime )
                        .toThrow( new InvalidArgumentError( 'Invalid time object. Missing date' ) );

                } );

                it( 'not object', function () {

                    extendedTime.date = 123;

                    expect( constructingExtendedTime )
                        .toThrow( new InvalidArgumentError(
                            'Invalid time object. Expected date as object, but got a number' ) );

                } );

                it( 'not Date', function () {

                    extendedTime.date = { ha: 'LOL' };

                    expect( constructingExtendedTime )
                        .toThrow( new InvalidArgumentError( 'Invalid time object. Expected date as instance of Date' ) );

                } );

            } );

            describe( 'should throw error if .epochStart', function () {

                it( 'not defined', function () {

                    delete extendedTime.epochStart;

                    expect( constructingExtendedTime )
                        .toThrow( new InvalidArgumentError( 'Invalid time object. Missing epochStart' ) );

                } );

                it( 'not number', function () {

                    extendedTime.epochStart = 'something very interesting';

                    expect( constructingExtendedTime )
                        .toThrow( new InvalidArgumentError(
                            'Invalid time object. Expected epochStart as number, but got a string' ) );

                } );

                it( 'is greater than 86399 (a day)', function () {

                    extendedTime.epochStart = 86400;

                    expect( constructingExtendedTime )
                        .toThrow( new InvalidArgumentError(
                            'Invalid time object. Lesson Can\'t starts on the next day after .date (epochStart is >86399)' ) );

                } );

            } );

            describe( 'should throw error if .duration', function () {

                it( 'not defined', function () {

                    delete extendedTime.duration;

                    expect( constructingExtendedTime )
                        .toThrow( new InvalidArgumentError( 'Invalid time object. Missing duration' ) );

                } );

                it( 'not number', function () {

                    extendedTime.duration = 'something very interesting';

                    expect( constructingExtendedTime )
                        .toThrow( new InvalidArgumentError(
                            'Invalid time object. Expected duration as number, but got a string' ) );

                } );

                it( 'less than 1', function () {

                    extendedTime.duration = 0.5;

                    expect( constructingExtendedTime )
                        .toThrow( new InvalidArgumentError(
                            'Invalid time object. Lesson should go on no less than 1 minute' ) );

                } );

            } );

            describe( 'should have', function () {

                beforeEach( function () {
                    constructingExtendedTime();
                } );

                it( 'date', function () {

                    expect( constructedLessonTimeExtended.date.getTime() ).toEqual( extendedTime.date.getTime() );

                } );

                it( 'epochStart', function () {

                    expect( constructedLessonTimeExtended.epochStart ).toEqual( extendedTime.epochStart );

                } );

                it( 'duration', function () {

                    expect( constructedLessonTimeExtended.duration ).toEqual( extendedTime.duration );

                } );

            } );

            it( 'should not throw anything if epochStart = 0', function () {

                extendedTime.epochStart = 0;

                expect( constructingExtendedTime )
                    .not.toThrow();

            } );

        } );

        describe( 'toSimpleTime()', function () {

            var extendedTimeObject = {},
                resultTime,
                getSimpleTimeByExtended;

            beforeEach( function () {

                getSimpleTimeByExtended = function ( extendedTimeObject ) {
                    return (new LessonTimeTools.LessonTimeExtended( extendedTimeObject )).toSimpleTime();
                };

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

            } );

        } );

        describe( 'isEqualToSimpleTime()', function () {

            var simpleTime, extendedTime;

            beforeEach( function () {

                simpleTime = new LessonTimeSimple( {
                    start: new Date( 2015, 5 - 1, 8, 14, 0 ),
                    end: new Date( 2015, 5 - 1, 8, 14, 30 )
                } );

                extendedTime = new LessonTimeExtended( {
                    date: new Date( 2015, 5 - 1, 8 ),
                    epochStart: 14 * 3600,
                    duration: 30
                } );

            } );

            it( 'should be equal', function () {

                expect( extendedTime.isEqualToSimpleTime( simpleTime ) ).toBeTruthy();

            } );

            it( 'should be not equal', function () {

                extendedTime = new LessonTimeExtended( {
                    date: new Date( 2015, 5 - 1, 8 ),
                    epochStart: 14 * 3600,
                    duration: 31
                } );


                expect( extendedTime.isEqualToSimpleTime( simpleTime ) ).toBeFalsy();

            } );

        } );

    } );

    describe( 'LessonTimePickerCtrl', function () {

        var $controller, LessonTimePickerCtrl, $scope;

        beforeEach( inject( function ( _$controller_, _$rootScope_ ) {

            $controller = _$controller_;
            $scope = _$rootScope_.$new( true );

            LessonTimePickerCtrl = $controller( 'LessonTimePickerCtrl', {
                $scope: $scope,
                LessonTimeSimple: LessonTimeSimple,
                LessonTimeExtended: LessonTimeExtended
            } );

            spyOn( LessonTimeTools.LessonTimeSimple.prototype, 'toExtendedTime' ).and.callThrough();
            spyOn( LessonTimeTools.LessonTimeExtended.prototype, 'toSimpleTime' ).and.callThrough();

            LessonTimeTools.LessonTimeSimple.prototype.toExtendedTime.calls.reset();
            LessonTimeTools.LessonTimeExtended.prototype.toSimpleTime.calls.reset();

        } ) );

        describe( 'timeObjectObserver()', function () {

            var timeObjectObserver, timeObject;

            beforeEach( function () {

                timeObjectObserver = LessonTimePickerCtrl.timeObjectObserver;

                timeObject = new LessonTimeSimple({
                    start: new Date( 2015, 5-1, 8, 14, 0 ),
                    end: new Date( 2015, 5-1, 8, 14, 30 )
                });

            } );

            it( 'should return false if new value is undefined', function () {

                expect( timeObjectObserver( undefined ) ).toEqual( false );

            } );

            it( 'should throw error if passed timeObject is not LessonTimeSimple instance', function () {


                expect( function () {
                    timeObjectObserver( {} );
                } ).toThrow( new InvalidArgumentError( 'New time object is not instance of LessonTimeSimple' ) );

            } );

            it( 'should convert new timeObject to extendedTime', function () {

                timeObjectObserver( timeObject );

                expect( LessonTimeTools.LessonTimeSimple.prototype.toExtendedTime ).toHaveBeenCalled();

                expect( $scope.extendedTime instanceof LessonTimeExtended ).toBeTruthy();

                expect( $scope.extendedTime.date.getFullYear() ).toEqual( 2015 );
                expect( $scope.extendedTime.date.getMonth() ).toEqual( 5-1 );
                expect( $scope.extendedTime.date.getDate() ).toEqual( 8 );

                expect( $scope.extendedTime.epochStart ).toEqual( 14 * 3600 );
                expect( $scope.extendedTime.duration ).toEqual( 30 );

            } );

            it( 'should not convert if new timeObject is equal to existing extendedTime', function () {

                $scope.extendedTime = timeObject.toExtendedTime();

                LessonTimeTools.LessonTimeSimple.prototype.toExtendedTime.calls.reset();

                timeObjectObserver( timeObject );

                expect( doesConverterWasCalled() ).toBeFalsy();

                ////////

                function doesConverterWasCalled() {
                    // because we do not calling toSimpleTime() when checking equality
                    return LessonTimeTools.LessonTimeSimple.prototype.toExtendedTime.calls.count() > 0;
                }

            } );

        } );

        describe( 'extendedTimeObserver()', function () {

            var extendedTimeObserver, extendedTime;

            beforeEach( function () {

                extendedTimeObserver = LessonTimePickerCtrl.extendedTimeObserver;

                extendedTime = new LessonTimeExtended({
                    date: new Date( 2015, 5-1, 8 ),
                    epochStart: 14 * 3600,
                    duration: 30
                });

            } );

            it( 'should return false if new value is undefined', function () {

                expect( extendedTimeObserver( undefined ) ).toEqual( false );

            } );

            it( 'should throw error if passed extendedTime is not LessonTimeExtended instance', function () {


                expect( function () {
                    extendedTimeObserver( {} );
                } ).toThrow( new InvalidArgumentError( 'New time object is not instance of LessonTimeExtended' ) );

            } );

            it( 'should convert new timeObject to extendedTime', function () {

                extendedTimeObserver( extendedTime );

                expect( LessonTimeTools.LessonTimeExtended.prototype.toSimpleTime ).toHaveBeenCalled();

                expect( $scope.timeObject instanceof LessonTimeSimple ).toBeTruthy();

                expect( $scope.timeObject.start.getFullYear() ).toEqual( 2015 );
                expect( $scope.timeObject.start.getMonth() ).toEqual( 5-1 );
                expect( $scope.timeObject.start.getDate() ).toEqual( 8 );
                expect( $scope.timeObject.start.getHours() ).toEqual( 14 );
                expect( $scope.timeObject.start.getMinutes() ).toEqual( 0 );

                expect( $scope.timeObject.end.getFullYear() ).toEqual( 2015 );
                expect( $scope.timeObject.end.getMonth() ).toEqual( 5-1 );
                expect( $scope.timeObject.end.getDate() ).toEqual( 8 );
                expect( $scope.timeObject.end.getHours() ).toEqual( 14 );
                expect( $scope.timeObject.end.getMinutes() ).toEqual( 30 );

            } );

            it( 'should not convert if new extendedTime is equal to existing timeObject', function () {

                $scope.timeObject = extendedTime.toSimpleTime();

                LessonTimeTools.LessonTimeExtended.prototype.toSimpleTime.calls.reset();

                extendedTimeObserver( extendedTime );

                expect( doesConverterWasCalled() ).toBeFalsy();

                /////

                function doesConverterWasCalled() {
                    // because we calling toSimpleTime() when checking equality
                    return LessonTimeTools.LessonTimeExtended.prototype.toSimpleTime.calls.count() > 1;
                }

            } );

        } );

        describe( 'watchers behaviour', function () {

            beforeEach( function () {

                spyOn( LessonTimePickerCtrl, 'timeObjectObserver' ).and.callThrough();
                spyOn( LessonTimePickerCtrl, 'extendedTimeObserver' ).and.callThrough();

                LessonTimePickerCtrl.timeObjectObserver.calls.reset();
                LessonTimePickerCtrl.extendedTimeObserver.calls.reset();

            } );

            describe( 'timeObject', function () {

                beforeEach( function () {

                    delete $scope.timeObject;
                    delete $scope.extendedTime;

                } );

                it( 'should update extendedTime on $apply and changing timeObject', function () {

                    $scope.timeObject = new LessonTimeSimple({
                        start: new Date( 2015, 5-1, 8, 14, 0 ),
                        end: new Date( 2015, 5-1, 8, 14, 30 )
                    });

                    $scope.$apply();

                    expect( $scope.extendedTime instanceof LessonTimeExtended ).toBeTruthy();
                    expect( $scope.extendedTime.epochStart ).toEqual( 14 * 3600 );

                } );

                it( 'should update if only .start has been changed', function () {

                    $scope.timeObject = new LessonTimeSimple({
                        start: new Date( 2015, 5-1, 7, 14, 0 ),
                        end: new Date( 2015, 5-1, 8, 14, 30 )
                    });

                    $scope.$apply();

                    expect( $scope.extendedTime.date.getDate() ).toEqual( 7 );

                } );

            } );

            describe( 'extendedTime', function () {

                it( 'should update extendedTime on $apply and changing timeObject', function () {

                    $scope.extendedTime = new LessonTimeExtended({
                        date: new Date( 2015, 5-1, 8 ),
                        epochStart: 14 * 3600,
                        duration: 30
                    });

                    $scope.$apply();

                    expect( $scope.timeObject instanceof LessonTimeSimple ).toBeTruthy();
                    expect( $scope.timeObject.start.getDate() ).toEqual( 8 );

                } );

                it( 'should update if only .duration has been changed', function () {

                    $scope.extendedTime = new LessonTimeExtended({
                        date: new Date( 2015, 5-1, 8 ),
                        epochStart: 14 * 3600,
                        duration: 40
                    });

                    $scope.$apply();

                    expect( $scope.timeObject.end.getMinutes() ).toEqual( 40 );

                } );

            } );

        } );

    } );

    describe( 'compiling', function () {

        var $compile, $scope, $controller, $rootScope, compileElement, element, resultElem, isolateScope;

        beforeEach( inject( function ( _$compile_, _$rootScope_, _$controller_ ) {

            $compile    = _$compile_;
            $scope      = _$rootScope_.$new();
            $controller = _$controller_;
            $rootScope  = _$rootScope_;

            compileElement = function ( html ) {

                var element = $compile( html )( $scope );

                $rootScope.$apply();

                return element;

            };

            $scope.mockTime = new LessonTimeSimple( {
                start: new Date( 2015, 5 - 1, 8, 14, 0 ),
                end: new Date( 2015, 5 - 1, 8, 14, 30 )
            } );
            resultElem      = compileElement( '<lesson-time-picker time-object="mockTime"></lesson-time-picker>' );

            isolateScope = resultElem.isolateScope();

        } ) );

        it( 'should compile directive', function () {

            expect( resultElem.html() ).toContain( 'ionic-datepicker' );

        } );

        it( 'should create isolated extended time object', function () {

            var extendedTime = isolateScope.extendedTime;

            expect( extendedTime instanceof LessonTimeExtended ).toBeTruthy();
            expect( extendedTime.date.getDate() ).toBe( 8 );
            expect( extendedTime.epochStart ).toBe( 14 * 3600 );
            expect( extendedTime.duration ).toBe( 30 );

        } );

        // todo: check behavior when changing timeObject and extendedTime

    } );
} );