describe( 'EditCtrl controller', function () {

    var EditCtrlScope, EditCtrl, resourceType, mockedLessonData;

    resourceType = 'Lesson';

    beforeEach( module( 'starter' ) );

    beforeEach( inject( function ( _$rootScope_, $controller ) {

        EditCtrlScope = _$rootScope_.$new();

        var additionalStateParamsMock = {
            resourceType: 'Lessons'
        };

        EditCtrl = $controller( 'EditCtrl', {
            $scope: EditCtrlScope,
            additionalStateParams: additionalStateParamsMock
        } );

    } ) );

    describe( 'getTimepickerTime()', function () {

        var theDate;

        beforeEach( function () {

            theDate = new Date();
            theDate.setHours( 0 );
            theDate.setMinutes( 0 );
            theDate.setSeconds( 0 );
            theDate.setMilliseconds( 0 );

            resourceType = 'Lesson';

        } );

        it( 'should return 0 if time 00:00', function () {

            theDate.setHours( 0 );
            theDate.setMinutes( 0 );

            expect( EditCtrlScope.getTimepickerTime( theDate ) ).toEqual( 0 );

        } );

        it( 'should return 3600 if time 01:00', function () {

            theDate.setHours( 1 );
            theDate.setMinutes( 0 );

            expect( EditCtrlScope.getTimepickerTime( theDate ) ).toEqual( 3600 );

        } );

        it( 'should return 5400 if time 01:30', function () {

            theDate.setHours( 1 );
            theDate.setMinutes( 30 );

            expect( EditCtrlScope.getTimepickerTime( theDate ) ).toEqual( 5400 );

        } );

        it( 'should return 7200 if time 02:00', function () {

            theDate.setHours( 2 );
            theDate.setMinutes( 0 );

            expect( EditCtrlScope.getTimepickerTime( theDate ) ).toEqual( 7200 );

        } );

        it( 'should return 9000 if time 02:30', function () {

            theDate.setHours( 2 );
            theDate.setMinutes( 30 );

            expect( EditCtrlScope.getTimepickerTime( theDate ) ).toEqual( 9000 );

        } );

        it( 'should do not forget about seconds. 00:00:01 should return 1', function () {

            theDate.setHours( 0 );
            theDate.setMinutes( 0 );
            theDate.setSeconds( 1 );

            expect( EditCtrlScope.getTimepickerTime( theDate ) ).toEqual( 1 );

        } );

    } );

    describe( 'lessonAdditionalData', function () {

        var additScope;

        describe( 'display ( .loadAdditionalObjectData() )', function () {

            beforeEach( function () {
                inject( function ( $rootScope, $controller, $q ) {
                    additScope = $rootScope.$new();

                    var startTime = new Date(),
                        endTime = new Date();

                    startTime.setDate( 8 );
                    startTime.setMonth( 5 - 1 );
                    startTime.setFullYear( 2015 );

                    startTime.setHours( 11 );
                    startTime.setMinutes( 0 );
                    startTime.setSeconds( 0 );
                    startTime.setMilliseconds( 0 );


                    endTime.setDate( 8 );
                    endTime.setMonth( 5 - 1 );
                    endTime.setFullYear( 2015 );

                    endTime.setHours( 11 );
                    endTime.setMinutes( 30 );
                    endTime.setSeconds( 0 );
                    endTime.setMilliseconds( 0 );

                    mockedLessonData = {
                        time: {
                            start: startTime,
                            end: endTime
                        }
                    };

                    var ApiMock = {
                        'Lessons': {
                            get: function ( params ) {
                                var deferred = $q.defer();

                                deferred.resolve( mockedLessonData );

                                return { $promise: deferred.promise };
                            }
                        }
                    };

                    $controller( 'EditCtrl', {
                        $scope: additScope,
                        additionalStateParams: {
                            resourceType: 'Lessons'
                        },
                        Api: ApiMock
                    } );

                    additScope.data = mockedLessonData;

                    additScope.loadAdditionalObjectData();
                } );
            } );

            it( '.date should return date without any hours/minutes/seconds/milliseconds', function () {

                /** @namespace additScope.lessonAdditionalData.date */

                // getting from time.start

                var milliseconds = additScope.lessonAdditionalData.date.getMilliseconds();
                var seconds = additScope.lessonAdditionalData.date.getSeconds();
                var minutes = additScope.lessonAdditionalData.date.getMinutes();
                var hours = additScope.lessonAdditionalData.date.getHours();

                expect( milliseconds ).toEqual( 0 );
                expect( seconds ).toEqual( 0 );
                expect( minutes ).toEqual( 0 );
                expect( hours ).toEqual( 0 );

            } );

            it( '.date should return correct date of time.start', function () {

                var day = additScope.lessonAdditionalData.date.getDate();
                var month = additScope.lessonAdditionalData.date.getMonth() + 1;
                var year = additScope.lessonAdditionalData.date.getFullYear();

                expect( day ).toEqual( 8 );
                expect( month ).toEqual( 5 );
                expect( year ).toEqual( 2015 );

            } );

            it( '.startTimeInSeconds', function () {

                /** @namespace additScope.lessonAdditionalData.startTimeInSeconds */

                expect( additScope.lessonAdditionalData.startTimeInSeconds ).toEqual( 39600 );

            } );

            it( '.getStringStartTime', function () {

                expect( additScope.lessonAdditionalData.getStringStartTime() ).toEqual( '11:00' );

            } );

            it( '.durationInMinutes', function () {

                /** @namespace additScope.lessonAdditionalData.durationInMinutes */

                expect( additScope.lessonAdditionalData.durationInMinutes ).toEqual( 30 );

            } );

        } );

        describe( 'save ( .applyAdditionalObjectData() )', function () {

            beforeEach( function () {
                inject( function ( $rootScope, $controller, $q ) {
                    additScope = $rootScope.$new();

                    var startTime = new Date(),
                        endTime = new Date();

                    mockedLessonData = {
                        time: {
                            start: startTime,
                            end: endTime
                        }
                    };

                    var ApiMock = {
                        'Lessons': {
                            get: function ( params ) {
                                var deferred = $q.defer();

                                deferred.resolve( mockedLessonData );

                                return { $promise: deferred.promise };
                            }
                        }
                    };

                    $controller( 'EditCtrl', {
                        $scope: additScope,
                        additionalStateParams: {
                            resourceType: 'Lessons'
                        }
                    } );

                    additScope.data = mockedLessonData;

                    additScope.loadAdditionalObjectData();
                } );
            } );

            it( 'should write .date to time.start and time.end equally', function () {

                var newLessonDate = new Date();

                newLessonDate.setDate( 2 );
                newLessonDate.setMonth( 8-1 );
                newLessonDate.setFullYear( 2016 );

                additScope.lessonAdditionalData.date = newLessonDate;

                additScope.applyAdditionalObjectData();

                expect( additScope.data.time.start.getDate() ).toEqual( 2 );
                expect( additScope.data.time.start.getMonth() ).toEqual( 8-1 );
                expect( additScope.data.time.start.getFullYear() ).toEqual( 2016 );

                expect( additScope.data.time.end.getDate() ).toEqual( 2 );
                expect( additScope.data.time.end.getMonth() ).toEqual( 8-1 );
                expect( additScope.data.time.end.getFullYear() ).toEqual( 2016 );

            } );

            it( 'should write .startTimeInSeconds to time.start', function () {

                additScope.lessonAdditionalData.startTimeInSeconds = 5400;
                additScope.applyAdditionalObjectData();

                expect( additScope.data.time.start.getHours() ).toEqual( 1 );
                expect( additScope.data.time.start.getMinutes() ).toEqual( 30 );

            } );

            it( 'should write .durationInMinutes to time.end', function () {

                additScope.lessonAdditionalData.startTimeInSeconds = 5400;
                additScope.lessonAdditionalData.durationInMinutes = 30;
                additScope.applyAdditionalObjectData();

                expect( additScope.data.time.start.getHours() ).toEqual( 1 );
                expect( additScope.data.time.start.getMinutes() ).toEqual( 30 );

                expect( additScope.data.time.end.getHours() ).toEqual( 2 );
                expect( additScope.data.time.end.getMinutes() ).toEqual( 0 );

            } );

        } );

    } );

} );