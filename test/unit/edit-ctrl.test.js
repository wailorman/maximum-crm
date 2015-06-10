fdescribe( 'EditCtrl controller', function () {

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

    fdescribe( 'lessonAdditionalData', function () {

        var lessonAdditionalDataScope;

        describe( 'display', function () {

            beforeEach( function () {
                inject( function ( $rootScope, $controller, $q ) {
                    lessonAdditionalDataScope = $rootScope.$new();

                    var startTime = new Date(),
                        endTime = new Date();

                    startTime.setDate(8);
                    startTime.setMonth(5-1);
                    startTime.setFullYear(2015);

                    startTime.setHours( 11 );
                    startTime.setMinutes( 0 );
                    startTime.setSeconds( 0 );
                    startTime.setMilliseconds( 0 );


                    endTime.setDate(8);
                    endTime.setMonth(5-1);
                    endTime.setFullYear(2015);

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
                        $scope: lessonAdditionalDataScope,
                        additionalStateParams: {
                            resourceType: 'Lessons'
                        },
                        Api: ApiMock
                    } );

                    lessonAdditionalDataScope.data = mockedLessonData;

                    lessonAdditionalDataScope.loadAdditionalObjectData();
                } );
            } );

            it( '.date should return date without any hours/minutes/seconds/milliseconds', function () {

                /** @namespace lessonAdditionalDataScope.lessonAdditionalData.date */

                // getting from time.start

                var milliseconds = lessonAdditionalDataScope.lessonAdditionalData.date.getMilliseconds();
                var seconds = lessonAdditionalDataScope.lessonAdditionalData.date.getSeconds();
                var minutes = lessonAdditionalDataScope.lessonAdditionalData.date.getMinutes();
                var hours = lessonAdditionalDataScope.lessonAdditionalData.date.getHours();

                expect( milliseconds ).toEqual( 0 );
                expect( seconds ).toEqual( 0 );
                expect( minutes ).toEqual( 0 );
                expect( hours ).toEqual( 0 );

            } );

            it( '.date should return correct date of time.start', function () {

                var day = lessonAdditionalDataScope.lessonAdditionalData.date.getDate();
                var month = lessonAdditionalDataScope.lessonAdditionalData.date.getMonth() + 1;
                var year = lessonAdditionalDataScope.lessonAdditionalData.date.getFullYear();

                expect( day ).toEqual( 8 );
                expect( month ).toEqual( 5 );
                expect( year ).toEqual( 2015 );

            } );

            it( '.startTimeInSeconds', function () {

                /** @namespace lessonAdditionalDataScope.lessonAdditionalData.startTimeInSeconds */

                expect( lessonAdditionalDataScope.lessonAdditionalData.startTimeInSeconds ).toEqual( 39600 );

            } );

            it( '.durationInMinutes', function () {

                /** @namespace lessonAdditionalDataScope.lessonAdditionalData.durationInMinutes */

                expect( lessonAdditionalDataScope.lessonAdditionalData.durationInMinutes ).toEqual( 30 );

            } );

        } );

    } );

} );