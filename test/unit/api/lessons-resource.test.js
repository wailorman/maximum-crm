fdescribe( 'Lessons resource', function () {

    var Lessons, $httpBackend, $resource,
        apiUri = 'http://api.max-crm.wailorman.ru:21080',
        callback = {
            error: function () {

            },
            success: function () {

            },
            notify: function () {

            }
        };

    beforeEach( function () {
        spyOn( callback, 'error' );
        spyOn( callback, 'success' );
        spyOn( callback, 'notify' );
    } );

    beforeEach( function () {
        resetSpies();
    } );

    /**
     *
     * @param {string} method
     * @param {number} status
     * @param {string} path
     * @param {object} [data]
     */
    var defineRespond = function ( method, status, path, data ) {

        $httpBackend.when( method, apiUri + path )
            .respond( status, data, {} );

    };

    /**
     *
     * @param {string} method
     * @param {string} path
     * @param {object} [data]
     */
    var expectRequest = function ( method, path, data ) {

        $httpBackend.expect( method, apiUri + path, data );

    };

    var resetSpies = function () {

        callback.success.calls.reset();
        callback.error.calls.reset();
        callback.notify.calls.reset();

    };

    beforeEach( module( 'starter.api.lessons' ) );

    beforeEach( inject( function ( _Lessons_, _$httpBackend_, _$resource_ ) {

        Lessons = _Lessons_;
        $httpBackend = _$httpBackend_;
        $resource = _$resource_;

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
                    date: new Date( 2015, 5 - 1, 8 ),
                    epochStart: 50400, // 14:00
                    duration: 30 // minutes
                };

                resultTime = Lessons.getSimpleTimeByExtended( extendedTimeObject );

            } );

            describe( 'time.start', function () {

                it( 'should calculate time.start correctly', function () {

                    expect( resultTime.start.getFullYear() ).toEqual( 2015 );
                    expect( resultTime.start.getMonth() ).toEqual( 5 - 1 );
                    expect( resultTime.start.getDate() ).toEqual( 8 );
                    expect( resultTime.start.getHours() ).toEqual( 14 );
                    expect( resultTime.start.getMinutes() ).toEqual( 0 );

                } );

                it( 'should works fine if epochStart >86400 (go to another day)', function () {

                    extendedTimeObject = {
                        date: new Date( 2015, 5 - 1, 8 ),
                        epochStart: 90000, // 1:00 of the next day
                        duration: 30 // minutes
                    };

                    resultTime = Lessons.getSimpleTimeByExtended( extendedTimeObject );

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

                    resultTime = Lessons.getSimpleTimeByExtended( extendedTimeObject );

                    expect( resultTime.start.getFullYear() ).toEqual( 2015 );
                    expect( resultTime.start.getMonth() ).toEqual( 5 - 1 );
                    expect( resultTime.start.getDate() ).toEqual( 8 );
                    expect( resultTime.start.getHours() ).toEqual( 0 );
                    expect( resultTime.start.getMinutes() ).toEqual( 0 );

                } );

                it( 'should return undefined and throw exception if we passed null', function () {

                    simpleTimeObject = {};

                    expect(
                        function () {
                            Lessons.getExtendedTimeBySimple( extendedTimeObject );
                        }
                    ).toThrow( new Error( "Not enough params" ) );

                } );

            } );

            describe( 'time.end', function () {

                it( 'should calculate time.end correctly', function () {

                    expect( resultTime.end.getFullYear() ).toEqual( 2015 );
                    expect( resultTime.end.getMonth() ).toEqual( 5 - 1 );
                    expect( resultTime.end.getDate() ).toEqual( 8 );
                    expect( resultTime.end.getHours() ).toEqual( 14 );
                    expect( resultTime.end.getMinutes() ).toEqual( 30 );

                } );

                it( 'should works fine if lesson duration is longer than a day (>1440)', function () {

                    extendedTimeObject = {
                        date: new Date( 2015, 5 - 1, 8 ),
                        epochStart: 50400, // 14:00
                        duration: 1500 // 1 day + 1 hour
                    };

                    resultTime = Lessons.getSimpleTimeByExtended( extendedTimeObject );

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

                    resultTime = Lessons.getSimpleTimeByExtended( extendedTimeObject );

                    expect( resultTime.end.getFullYear() ).toEqual( 2015 );
                    expect( resultTime.end.getMonth() ).toEqual( 5 - 1 );
                    expect( resultTime.end.getDate() ).toEqual( 8 );
                    expect( resultTime.end.getHours() ).toEqual( 14 );
                    expect( resultTime.end.getMinutes() ).toEqual( 0 );

                } );

            } );

            it( 'should return undefined and throw exception if we passed null', function () {

                extendedTimeObject = {};

                expect(
                    function () {
                        Lessons.getSimpleTimeByExtended( extendedTimeObject );
                    }
                ).toThrow( new Error( "Not enough params (date missing)" ) );

            } );

        } );

    } );

    describe( 'populateArray', function () {

        var arrayToPopulate,
            coachesResource;

        beforeEach( function () {

            arrayToPopulate = ['coach1', 'coach2'];

            defineRespond( 'GET', 200, '/coaches/coach1', {
                _id: 'coach1',
                name: 'The Coach 1'
            } );

            defineRespond( 'GET', 200, '/coaches/coach2', {
                _id: 'coach2',
                name: 'The Coach 2'
            } );

            defineRespond( 'GET', 404, '/coaches/coach3' );
            defineRespond( 'GET', 404, '/coaches/coach4' );

            coachesResource = $resource( apiUri + '/coaches/:id', null,
                {
                    '_get': { method: 'GET' }
                }
            );

        } );

        it( 'should be called and requested two objects from Coaches resource', function () {

            resetSpies();

            Lessons.populateArray( coachesResource, arrayToPopulate )
                .then( callback.success, callback.error );

            $httpBackend.flush();

            expectRequest( 'GET', '/coaches/coach1' );
            expectRequest( 'GET', '/coaches/coach2' );

            expect( callback.error ).not.toHaveBeenCalled();
            expect( callback.success ).toHaveBeenCalled();

        } );

        it( 'should call callback.success with array of populated coaches', function () {

            resetSpies();

            Lessons.populateArray( coachesResource, arrayToPopulate )
                .then( callback.success, callback.error );

            $httpBackend.flush();

            expect( callback.success.calls.mostRecent().args[0] instanceof Array ).toBeTruthy();

            expect( callback.success.calls.mostRecent().args[0][0]._id ).toEqual( 'coach1' );
            expect( callback.success.calls.mostRecent().args[0][1]._id ).toEqual( 'coach2' );

            expect( callback.success.calls.mostRecent().args[0][0].name ).toEqual( 'The Coach 1' );
            expect( callback.success.calls.mostRecent().args[0][1].name ).toEqual( 'The Coach 2' );

        } );

        it( 'should call callback.notify and callback.success too if one of two objects can not found', function () {

            arrayToPopulate = ['coach1', 'coach3'];

            resetSpies();

            Lessons.populateArray( coachesResource, arrayToPopulate )
                .then( callback.success, callback.error, callback.notify );

            $httpBackend.flush();

            expectRequest( 'GET', '/coaches/coach1' );
            expectRequest( 'GET', '/coaches/coach3' );

            expect( callback.notify ).toHaveBeenCalled();
            expect( callback.success ).toHaveBeenCalled();

            expect( callback.notify.calls.count() ).toEqual( 1 );
            expect( callback.notify.calls.mostRecent().args[0] ).toEqual( "Can't find coach3" );

        } );

        it( 'should call callback.error and callback.notify if 2/2 objects responds with 404', function () {

            arrayToPopulate = ['coach3', 'coach4'];

            resetSpies();

            Lessons.populateArray( coachesResource, arrayToPopulate )
                .then( callback.success, callback.error, callback.notify );

            $httpBackend.flush();

            expectRequest( 'GET', '/coaches/coach3' );
            expectRequest( 'GET', '/coaches/coach4' );

            expect( callback.success ).not.toHaveBeenCalled();
            expect( callback.error ).toHaveBeenCalled();
            expect( callback.notify ).toHaveBeenCalled();

            expect( callback.notify.calls.count() ).toEqual( 2 );
            expect( callback.error.calls.count() ).toEqual( 1 );

            expect( callback.error.calls.mostRecent().args[0] ).toEqual( "Can't find any object" );

            // I wont check notify callback args bcz I made sure it calls correctly in previous test

        } );

    } );

    describe( 'get', function () {

        var resultObject = {};

        beforeEach( function () {

            ///////////   CORRECT    ///////////////////

            // LESSONS

            defineRespond( 'GET', 200, '/lessons/lesson-correct', {
                time: {
                    start: new Date( 2015, 5 - 1, 8, 14, 0 ),
                    end: new Date( 2015, 5 - 1, 8, 14, 30 )
                },
                coaches: ['coach1', 'coach2'],
                halls: ['hall1', 'hall2'],
                groups: ['group1', 'group2']
            } );

            // COACHES

            defineRespond( 'GET', 200, '/coaches/coach1', {
                _id: 'coach1',
                name: 'The Coach 1'
            } );

            defineRespond( 'GET', 200, '/coaches/coach2', {
                _id: 'coach2',
                name: 'The Coach 2'
            } );

            // HALLS

            defineRespond( 'GET', 200, '/halls/hall1', {
                _id: 'hall1',
                name: 'The Hall 1'
            } );

            defineRespond( 'GET', 200, '/halls/hall2', {
                _id: 'hall2',
                name: 'The Hall 2'
            } );

            // GROUPS

            defineRespond( 'GET', 200, '/groups/group1', {
                _id: 'group1',
                name: 'The Group 1'
            } );

            defineRespond( 'GET', 200, '/groups/group2', {
                _id: 'group2',
                name: 'The Group 2'
            } );

            Lessons.get( { id: 'lesson-correct' } ).$promise
                .then( callback.success, callback.error, callback.notify );

            $httpBackend.flush();

            ///////////   INCORRECT   /////////////

            defineRespond( 'GET', 200, '/lessons/lesson-incorrect', {
                time: {
                    start: new Date( 2015, 5 - 1, 8, 14, 0 ),
                    end: new Date( 2015, 5 - 1, 8, 14, 30 )
                },
                coaches: ['coach1', 'coach3'],
                halls: ['hall1', 'hall3'],
                groups: ['group1', 'group3']
            } );

            defineRespond( 'GET', 404, '/lessons/lesson-nonexistent', {} );

            defineRespond( 'GET', 404, '/coaches/coach3', {} );
            defineRespond( 'GET', 404, '/halls/hall3', {} );
            defineRespond( 'GET', 404, '/groups/group3', {} );

        } );

        it( 'should call only success callback', function () {

            expect( callback.success ).toHaveBeenCalled();
            expect( callback.error ).not.toHaveBeenCalled();
            expect( callback.notify ).not.toHaveBeenCalled();

        } );

        it( 'should pass result data with success callback', function () {

            expect( callback.success.calls.mostRecent().args[0].time ).toBeDefined();
            expect( callback.success.calls.mostRecent().args[0].coaches ).toBeDefined();
            expect( callback.success.calls.mostRecent().args[0].halls ).toBeDefined();
            expect( callback.success.calls.mostRecent().args[0].groups ).toBeDefined();

        } );

        describe( 'should convert document to object', function () {

            beforeEach( function () {

                resultObject = callback.success.calls.mostRecent().args[0];

            } );

            it( 'time.date should = 08.05.2015', function () {

                expect( resultObject.time.date.getFullYear() ).toEqual( 2015 );
                expect( resultObject.time.date.getMonth() ).toEqual( 5 - 1 );
                expect( resultObject.time.date.getDate() ).toEqual( 8 );

            } );

            it( 'time.epochStart should = 50400 (14:00)', function () {

                expect( resultObject.time.epochStart ).toEqual( 50400 );

            } );

            it( 'time.duration should = 30', function () {

                expect( resultObject.time.duration ).toEqual( 30 );

            } );

            it( 'coaches', function () {

                expect( resultObject.coaches[0]._id ).toEqual( 'coach1' );
                expect( resultObject.coaches[1]._id ).toEqual( 'coach2' );

                expect( resultObject.coaches[0].name ).toEqual( 'The Coach 1' );
                expect( resultObject.coaches[1].name ).toEqual( 'The Coach 2' );

            } );

            it( 'halls', function () {

                expect( resultObject.halls[0]._id ).toEqual( 'hall1' );
                expect( resultObject.halls[1]._id ).toEqual( 'hall2' );

                expect( resultObject.halls[0].name ).toEqual( 'The Hall 1' );
                expect( resultObject.halls[1].name ).toEqual( 'The Hall 2' );

            } );

            it( 'groups', function () {

                expect( resultObject.groups[0]._id ).toEqual( 'group1' );
                expect( resultObject.groups[1]._id ).toEqual( 'group2' );

                expect( resultObject.groups[0].name ).toEqual( 'The Group 1' );
                expect( resultObject.groups[1].name ).toEqual( 'The Group 2' );

            } );

        } );

        it( 'should notify 3 times when some object cannot be populated', function () {

            resetSpies();

            Lessons.get( { id: 'lesson-incorrect' } ).$promise
                .then( callback.success, callback.error, callback.notify );

            $httpBackend.flush();

            expect( callback.success ).toHaveBeenCalled();
            expect( callback.notify ).toHaveBeenCalled();
            expect( callback.error ).not.toHaveBeenCalled();

            expect( callback.notify.calls.count() ).toEqual( 3 );

        } );

        it( 'should call callback.error when responding 404', function () {

            resetSpies();

            Lessons.get( { id: 'lesson-nonexistent' } ).$promise
                .then( callback.success, callback.error, callback.notify );

            $httpBackend.flush();

            expect( callback.success ).not.toHaveBeenCalled();
            expect( callback.error ).toHaveBeenCalled();

        } );

    } );

    describe( 'depopulateArray', function () {

        var arrayOfObjects;

        it( 'should return empty array if we passing to him null', function () {

            var result = Lessons.depopulateArray( null );
            expect( result instanceof Array ).toBeTruthy();
            expect( result ).toEqual( [] );

        } );

        it( 'should convert array of objects with _id property to plane array', function () {

            arrayOfObjects = [
                { _id: 'coach1', name: 'The Coach 1' },
                { _id: 'coach2', name: 'The Coach 2' }
            ];

            var result = Lessons.depopulateArray( arrayOfObjects );

            expect( result.length ).toEqual( 2 );
            expect( result[0] ).toEqual( 'coach1' );
            expect( result[1] ).toEqual( 'coach2' );

        } );

        it( 'should ignore element if object does not have _id property', function () {

            arrayOfObjects = [
                { _id: 'coach1', name: 'The Coach 1' },
                { name: 'The Coach 2' }
            ];

            expect( Lessons.depopulateArray( arrayOfObjects ) ).toEqual( ['coach1'] );

        } );

        it( 'should works fine if we will pass array with objects which have only _id property', function () {

            arrayOfObjects = [
                { _id: 'coach1' },
                { _id: 'coach2' }
            ];

            expect( Lessons.depopulateArray( arrayOfObjects ) ).toEqual( ['coach1', 'coach2'] );

        } );

        it( 'should return [] if we will pass empty array to arguments', function () {

            arrayOfObjects = [];

            expect( Lessons.depopulateArray( arrayOfObjects ) ).toEqual( [] );

        } );

        it( 'should works fine if some elem of array is object and some elem is string', function () {

            arrayOfObjects = [
                { _id: 'coach1', name: 'The Coach 1' },
                'coach2'
            ];

            var result = Lessons.depopulateArray( arrayOfObjects );

            expect( result.length ).toEqual( 2 );
            expect( result[0] ).toEqual( 'coach1' );
            expect( result[1] ).toEqual( 'coach2' );

        } );

        it( 'should works with numbers too', function () {

            arrayOfObjects = [
                { _id: 'coach1' },
                'coach2',
                345
            ];

            var result = Lessons.depopulateArray( arrayOfObjects );

            expect( result.length ).toEqual( 3 );
            expect( result[0] ).toEqual( 'coach1' );
            expect( result[1] ).toEqual( 'coach2' );
            expect( result[2] ).toEqual( 345 );

        } );

    } );

    describe( 'create', function () {

        var objectToPost,
            expected;

        beforeEach( function () {

            objectToPost = {
                _id: 'new-lesson',
                time: {
                    date: new Date( 2015, 5 - 1, 8 ),
                    epochStart: 50400,
                    duration: 30
                },
                coaches: [
                    { _id: 'coach1', name: 'The Coach 1' },
                    { _id: 'coach2', name: 'The Coach 2' }
                ],
                halls: [
                    { _id: 'hall1', name: 'The Hall 1' },
                    { _id: 'hall2', name: 'The Hall 2' }
                ],
                groups: [
                    { _id: 'group1', name: 'The Group 1' },
                    { _id: 'group2', name: 'The Group 2' }
                ]
            };

            expected = {
                time: {
                    start: new Date( 2015, 5 - 1, 8, 14, 0 ),
                    end: new Date( 2015, 5 - 1, 8, 14, 30 )
                },
                coaches: ['coach1', 'coach2'],
                halls: ['hall1', 'hall2'],
                groups: ['group1', 'group2']
            };

            resetSpies();

        } );

        it( 'should correctly convert time to simple format', function () {

            defineRespond( 'POST', 200, '/lessons', {} );

            Lessons.create( objectToPost ).$promise
                .then( callback.success, callback.error, callback.notify );

            expectRequest( 'POST', '/lessons', {
                _id: 'new-lesson',
                time: expected.time,
                coaches: expected.coaches,
                halls: expected.halls,
                groups: expected.groups
            } );

            $httpBackend.flush();

            expect( callback.success ).toHaveBeenCalled();
            expect( callback.error ).not.toHaveBeenCalled();
            expect( callback.notify ).not.toHaveBeenCalled();

        } );

        it( 'should call reject if all data if correct but something went wrong on the server', function () {

            defineRespond( 'POST', 409, '/lessons', {} );

            Lessons.create( objectToPost ).$promise
                .then( callback.success, callback.error, callback.notify );

            $httpBackend.flush();

            expect( callback.success ).not.toHaveBeenCalled();
            expect( callback.error ).toHaveBeenCalled();
            expect( callback.notify ).not.toHaveBeenCalled();

            expect( callback.error.calls.mostRecent().args[0].status ).toEqual( 409 );

        } );

        it( 'should throw an error if _id was not passed', function () {

            delete objectToPost._id;

            expect( function () {
                Lessons.create( objectToPost );
            } ).toThrow( new Error( 'Missing _id' ) );

        } );

        it( 'should throw an error if time is invalid', function () {

            delete objectToPost.time.date;

            expect( function () {
                Lessons.create( objectToPost );
            } ).toThrow( new Error( 'Invalid time' ) );

        } );

        it( 'should set doc.coaches: [] if we did not passed coaches', function () {

            delete objectToPost.coaches;

            defineRespond( 'POST', 200, '/lessons', {} );

            Lessons.create( objectToPost ).$promise
                .then( callback.success, callback.error, callback.notify );

            expectRequest( 'POST', '/lessons', {
                _id: 'new-lesson',
                time: expected.time,
                coaches: [],
                halls: expected.halls,
                groups: expected.groups
            } );

            $httpBackend.flush();

            expect( callback.success ).toHaveBeenCalled();
            expect( callback.error ).not.toHaveBeenCalled();
            expect( callback.notify ).not.toHaveBeenCalled();

        } );

    } );

} );