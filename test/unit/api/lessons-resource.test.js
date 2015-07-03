fdescribe( 'Lessons resource', function () {

    var Lessons, $httpBackend, $resource, $q, $log, dependedObjects,
        apiUri = 'http://api.max-crm.wailorman.ru:21080',
        callback = {
            error: function () {

            },
            success: function () {

            },
            notify: function () {

            }
        };

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

    var resetCallbackSpies = function () {

        callback.success.calls.reset();
        callback.error.calls.reset();
        callback.notify.calls.reset();

    };

    var defineDependentObjects = function () {

        dependedObjects = {
            'lesson-correct': {
                _id: 'lesson-correct',
                time: {
                    start: new Date( 2015, 5 - 1, 8, 14, 0 ),
                    end: new Date( 2015, 5 - 1, 8, 14, 30 )
                },
                coaches: ['coach1', 'coach2'],
                halls: ['hall1', 'hall2'],
                groups: ['group1', 'group2']
            },
            'lesson-incorrect': {
                time: {
                    start: new Date( 2015, 5 - 1, 8, 14, 0 ),
                    end: new Date( 2015, 5 - 1, 8, 14, 30 )
                },
                coaches: ['coach1', 'coach3'],
                halls: ['hall1', 'hall3'],
                groups: ['group1', 'group3']
            },
            coach1: {
                _id: 'coach1',
                name: 'The Coach 1'
            },
            coach2: {
                _id: 'coach2',
                name: 'The Coach 2'
            },
            hall1: {
                _id: 'hall1',
                name: 'The Hall 1'
            },
            hall2: {
                _id: 'hall2',
                name: 'The Hall 2'
            },
            group1: {
                _id: 'group1',
                name: 'The Group 1'
            },
            group2: {
                _id: 'group2',
                name: 'The Group 2'
            }
        };

        defineRespond( 'GET', 200, '/lessons/lesson-correct', dependedObjects['lesson-correct'] );

        // COACHES

        defineRespond( 'GET', 200, '/coaches/coach1', dependedObjects.coach1 );

        defineRespond( 'GET', 200, '/coaches/coach2', dependedObjects.coach2 );

        // HALLS

        defineRespond( 'GET', 200, '/halls/hall1', dependedObjects.hall1 );

        defineRespond( 'GET', 200, '/halls/hall2', dependedObjects.hall2 );

        // GROUPS

        defineRespond( 'GET', 200, '/groups/group1', dependedObjects.group1 );

        defineRespond( 'GET', 200, '/groups/group2', dependedObjects.group2 );

        ///////////   INCORRECT   /////////////

        defineRespond( 'GET', 200, '/lessons/lesson-incorrect', dependedObjects['lesson-incorrect'] );

        defineRespond( 'GET', 404, '/lessons/lesson-nonexistent', {} );

        defineRespond( 'GET', 404, '/coaches/coach3', {} );
        defineRespond( 'GET', 404, '/halls/hall3', {} );
        defineRespond( 'GET', 404, '/groups/group3', {} );

    };

    beforeEach( module( 'starter.api.lessons' ) );

    // define spies on callbacks
    beforeEach( function () {
        spyOn( callback, 'error' );
        spyOn( callback, 'success' );
        spyOn( callback, 'notify' );
    } );

    // reset callback spies
    beforeEach( function () {
        resetCallbackSpies();
    } );

    // injector
    beforeEach( inject( function ( _Lessons_, _$httpBackend_, _$resource_,
        _$q_, _$log_ ) {

        Lessons = _Lessons_;
        $httpBackend = _$httpBackend_;
        $resource = _$resource_;
        $q = _$q_;
        $log = _$log_;

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

    // todo: Passing null to document
    describe( 'documentToObject()', function () {

        var mockedDocument;
        var convertedObject;

        var resetLogSpy = function () {

            $log.error.calls.reset();

        };

        var convertDocumentToObject = function () {
            Lessons.documentToObject( mockedDocument )
                .then( callback.success, callback.error, callback.notify );

            $httpBackend.flush();

            convertedObject = callback.success.calls.mostRecent().args[0];
        };

        // define objects
        beforeEach( function () {
            defineDependentObjects();
        } );

        beforeEach( function () {

            // enable spies
            spyOn( $log, 'error' );

            resetLogSpy();

            // redefine mocked objects
            mockedDocument = {
                _id: 'lesson1',
                time: {
                    start: new Date( 2015, 5 - 1, 8, 14, 0 ),
                    end: new Date( 2015, 5 - 1, 8, 14, 30 )
                },
                coaches: ['coach1', 'coach2'],
                halls: ['hall1', 'hall2'],
                groups: ['group1', 'group2']
            };

        } );

        describe( 'should log if did not passed', function () {

            it( '_id', function () {

                delete mockedDocument._id;

                Lessons.documentToObject( mockedDocument );

                expect( $log.error.calls.mostRecent().args[0] ).toEqual( 'Missing _id property in document' );

            } );

            it( 'time', function () {

                delete mockedDocument.time;

                Lessons.documentToObject( mockedDocument );

                expect( $log.error.calls.first().args[0] ).toEqual( 'Missing time property in document' );

            } );

            it( 'time.start', function () {

                delete mockedDocument.time.start;

                Lessons.documentToObject( mockedDocument );

                expect( $log.error.calls.first().args[0] ).toEqual( 'Missing time.start property in document' );

            } );

            it( 'time.end', function () {

                delete mockedDocument.time.end;

                Lessons.documentToObject( mockedDocument );

                expect( $log.error.calls.first().args[0] ).toEqual( 'Missing time.end property in document' );

            } );

        } );

        it( 'should return promise and call callback.success', function () {

            convertDocumentToObject();

            expect( callback.success ).toHaveBeenCalled();
            expect( callback.error ).not.toHaveBeenCalled();
            expect( callback.notify ).not.toHaveBeenCalled();

        } );

        describe( 'populating', function () {

            beforeEach( function () {
                convertDocumentToObject();
            } );

            it( 'coaches', function () {

                expect( convertedObject.coaches ).toBeDefined();
                expect( convertedObject.coaches instanceof Array ).toBeTruthy();
                expect( convertedObject.coaches.length ).toEqual( 2 );

                expect( convertedObject.coaches[0]._id ).toEqual( 'coach1' );
                expect( convertedObject.coaches[0].name ).toEqual( 'The Coach 1' );

                expect( convertedObject.coaches[1]._id ).toEqual( 'coach2' );
                expect( convertedObject.coaches[1].name ).toEqual( 'The Coach 2' );

            } );

            it( 'halls', function () {

                expect( convertedObject.halls ).toBeDefined();
                expect( convertedObject.halls instanceof Array ).toBeTruthy();
                expect( convertedObject.halls.length ).toEqual( 2 );

                expect( convertedObject.halls[0]._id ).toEqual( 'hall1' );
                expect( convertedObject.halls[0].name ).toEqual( 'The Hall 1' );

                expect( convertedObject.halls[1]._id ).toEqual( 'hall2' );
                expect( convertedObject.halls[1].name ).toEqual( 'The Hall 2' );

            } );

            it( 'groups', function () {

                expect( convertedObject.groups ).toBeDefined();
                expect( convertedObject.groups instanceof Array ).toBeTruthy();
                expect( convertedObject.groups.length ).toEqual( 2 );

                expect( convertedObject.groups[0]._id ).toEqual( 'group1' );
                expect( convertedObject.groups[0].name ).toEqual( 'The Group 1' );

                expect( convertedObject.groups[1]._id ).toEqual( 'group2' );
                expect( convertedObject.groups[1].name ).toEqual( 'The Group 2' );

            } );

            describe( 'check populating correctness', function () {

                describe( 'should return [] array if', function () {

                    it( 'if we did not passed coaches prop in document', function () {

                        delete mockedDocument.coaches;

                        convertDocumentToObject();

                        expect( convertedObject.coaches instanceof Array ).toBeTruthy();
                        expect( convertedObject.coaches.length ).toEqual( 0 );

                    } );

                    it( 'if one coach only passed is not exists', function () {

                        mockedDocument.coaches = ['coach3'];

                        convertDocumentToObject();

                        expect( convertedObject.coaches instanceof Array ).toBeTruthy();
                        expect( convertedObject.coaches.length ).toEqual( 0 );

                    } );

                } );

            } );

            describe( 'should call notify on loading errors', function () {

                it( 'coaches', function () {

                    mockedDocument.coaches = ['coach3'];

                    convertDocumentToObject();

                    expect( callback.notify ).toHaveBeenCalled();
                    expect( callback.notify.calls.mostRecent().args[0] instanceof Error ).toBeTruthy();

                } );

                it( 'halls', function () {

                    mockedDocument.halls = ['hall3'];

                    convertDocumentToObject();

                    expect( callback.notify ).toHaveBeenCalled();
                    expect( callback.notify.calls.mostRecent().args[0] instanceof Error ).toBeTruthy();

                } );

                it( 'groups', function () {

                    mockedDocument.groups = ['group3'];

                    convertDocumentToObject();

                    expect( callback.notify ).toHaveBeenCalled();
                    expect( callback.notify.calls.mostRecent().args[0] instanceof Error ).toBeTruthy();

                } );

            } );

        } );

        it( '_id', function () {

            convertDocumentToObject();
            expect( convertedObject._id ).toBeDefined();
            expect( typeof convertedObject._id ).toEqual( 'string' );
            expect( convertedObject._id ).toEqual( 'lesson1' );

        } );

        describe( 'time', function () {

            beforeEach( function () {

                convertDocumentToObject();

            } );

            it( 'date', function () {

                expect( convertedObject.time.date.getDate() ).toEqual( 8 );
                expect( convertedObject.time.date.getMonth() ).toEqual( 5 - 1 );
                expect( convertedObject.time.date.getFullYear() ).toEqual( 2015 );

            } );

            it( 'epochStart', function () {

                expect( convertedObject.time.epochStart ).toEqual( 50400 );

            } );

            it( 'duration', function () {

                expect( convertedObject.time.duration ).toEqual( 30 );

            } );

        } );

    } );

    describe( 'objectToDocument()', function () {

        var mockedObject,
            resultDocument;

        var convertObject = function () {
            resultDocument = Lessons.objectToDocument( mockedObject );
        };

        beforeEach( function () {

            mockedObject = {
                $resolved: true,
                _id: 'lesson1',
                time: {
                    date: new Date( 2015, 5 - 1, 8 ),
                    epochStart: 50400, // 14:00
                    duration: 30
                },
                coaches: [dependedObjects.coach1, dependedObjects.coach2],
                halls: [dependedObjects.hall1, dependedObjects.hall2],
                groups: [dependedObjects.group1, dependedObjects.group2]
            };

        } );

        it( 'should throw exception if we did not passed an object', function () {

            mockedObject = null;

            expect( function () {

                convertObject();

            } ).toThrow( new Error( 'Missing object' ) );

        } );

        describe( '_id', function () {

            it( 'should ignore _id if $resolved not defined', function () {

                delete mockedObject.$resolved;

                convertObject();

                expect( resultDocument._id ).not.toBeDefined();

            } );

            it( 'should ignore _id if $resolved == false', function () {

                mockedObject.$resolved = false;

                convertObject();

                expect( resultDocument._id ).not.toBeDefined();

            } );

            it( 'should throw exception if $resolved == true and _id is not defined', function () {

                delete mockedObject._id;

                expect( function () {
                    convertObject();
                } ).toThrow( new Error( 'Missing _id property' ) );

            } );

            it( 'should add _id property if $resolved == true', function () {

                convertObject();

                expect( resultDocument._id ).toEqual( 'lesson1' );

            } );

        } );

        describe( 'time', function () {

            it( 'should throw exception if we did not passed time.date', function () {

                delete mockedObject.time.date;

                expect( function () {
                    convertObject();
                } ).toThrow();

            } );

            it( 'should convert time correctly', function () {

                convertObject();

                expect( resultDocument.time.start.getDate() ).toEqual( 8 );
                expect( resultDocument.time.start.getMonth() ).toEqual( 5 - 1 );
                expect( resultDocument.time.start.getFullYear() ).toEqual( 2015 );
                expect( resultDocument.time.start.getHours() ).toEqual( 14 );
                expect( resultDocument.time.start.getMinutes() ).toEqual( 0 );

                expect( resultDocument.time.end.getDate() ).toEqual( 8 );
                expect( resultDocument.time.end.getMonth() ).toEqual( 5 - 1 );
                expect( resultDocument.time.end.getFullYear() ).toEqual( 2015 );
                expect( resultDocument.time.end.getHours() ).toEqual( 14 );
                expect( resultDocument.time.end.getMinutes() ).toEqual( 30 );

            } );

        } );

        describe( 'depopulating', function () {

            describe( 'should correctly depopulate', function () {

                beforeEach( function () {

                    convertObject();

                } );

                it( 'coaches', function () {

                    expect( resultDocument.coaches[0] ).toEqual( dependedObjects.coach1._id );
                    expect( resultDocument.coaches[1] ).toEqual( dependedObjects.coach2._id );

                } );

                it( 'halls', function () {

                    expect( resultDocument.halls[0] ).toEqual( dependedObjects.hall1._id );
                    expect( resultDocument.halls[1] ).toEqual( dependedObjects.hall2._id );

                } );

                it( 'groups', function () {

                    expect( resultDocument.groups[0] ).toEqual( dependedObjects.group1._id );
                    expect( resultDocument.groups[1] ).toEqual( dependedObjects.group2._id );

                } );

            } );

        } );

    } );

    describe( 'get', function () {

        var resultObject = {};

        beforeEach( function () {

            ///////////   CORRECT    ///////////////////

            // LESSONS

            defineRespond( 'GET', 200, '/lessons/lesson-correct', {
                _id: 'lesson-correct',
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

            expect( callback.success.calls.mostRecent().args[0]._id ).toBeDefined();
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

        describe( 'should find required properties in result object', function () {

            var resultObject;

            beforeEach( function () {
                resultObject = callback.success.calls.mostRecent().args[0];
            } );

            it( '_id', function () {

                expect( resultObject.hasOwnProperty( '_id' ) ).toBeTruthy();
                expect( typeof resultObject._id ).toEqual( 'string' );

            } );

            it( 'time', function () {

                expect( resultObject.hasOwnProperty( 'time' ) ).toBeTruthy();
                expect( resultObject.time.hasOwnProperty( 'date' ) ).toBeTruthy();
                expect( resultObject.time.hasOwnProperty( 'epochStart' ) ).toBeTruthy();
                expect( resultObject.time.hasOwnProperty( 'duration' ) ).toBeTruthy();
                expect( resultObject.time.hasOwnProperty( 'start' ) ).toBeTruthy();
                expect( resultObject.time.hasOwnProperty( 'end' ) ).toBeTruthy();

                expect( typeof resultObject.time ).toEqual( 'object' );
                expect( typeof resultObject.time.date ).toEqual( 'object' );
                expect( typeof resultObject.time.epochStart ).toEqual( 'number' );
                expect( typeof resultObject.time.duration ).toEqual( 'number' );
                expect( typeof resultObject.time.start ).toEqual( 'object' );
                expect( typeof resultObject.time.end ).toEqual( 'object' );

            } );

            it( 'coaches', function () {

                expect( resultObject.hasOwnProperty( 'coaches' ) ).toBeTruthy();
                expect( resultObject.coaches instanceof Array ).toBeTruthy();

            } );

            it( 'halls', function () {

                expect( resultObject.hasOwnProperty( 'halls' ) ).toBeTruthy();
                expect( resultObject.halls instanceof Array ).toBeTruthy();

            } );

            it( 'groups', function () {

                expect( resultObject.hasOwnProperty( 'groups' ) ).toBeTruthy();
                expect( resultObject.groups instanceof Array ).toBeTruthy();

            } );

        } );

        it( 'should notify 3 times when some object cannot be populated', function () {

            resetCallbackSpies();

            Lessons.get( { id: 'lesson-incorrect' } ).$promise
                .then( callback.success, callback.error, callback.notify );

            $httpBackend.flush();

            expect( callback.success ).toHaveBeenCalled();
            expect( callback.notify ).toHaveBeenCalled();
            expect( callback.error ).not.toHaveBeenCalled();

            expect( callback.notify.calls.count() ).toEqual( 3 );

        } );

        it( 'should call callback.error when responding 404', function () {

            resetCallbackSpies();

            Lessons.get( { id: 'lesson-nonexistent' } ).$promise
                .then( callback.success, callback.error, callback.notify );

            $httpBackend.flush();

            expect( callback.success ).not.toHaveBeenCalled();
            expect( callback.error ).toHaveBeenCalled();

        } );

    } );

    describe( 'create', function () {

        var objectToPost,
            expected;

        beforeEach( function () {

            objectToPost = {
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

            resetCallbackSpies();

        } );

        it( 'should correctly convert time to simple format', function () {

            defineRespond( 'POST', 200, '/lessons', {} );

            Lessons.create( objectToPost ).$promise
                .then( callback.success, callback.error, callback.notify );

            expectRequest( 'POST', '/lessons', {
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

    describe( 'update', function () {

        var documentsToRespond = {},
            originalObject;

        beforeEach( function () {

            resetCallbackSpies();

            documentsToRespond.lesson1 = {
                _id: 'lesson1',
                time: {
                    start: new Date( 2015, 5 - 1, 8, 14, 0 ),
                    end: new Date( 2015, 5 - 1, 8, 14, 30 )
                },
                coaches: ['coach1', 'coach2'],
                halls: ['hall1', 'hall2'],
                groups: ['group1', 'group2']
            };

            defineRespond( 'GET', 200, '/lessons/lesson1', documentsToRespond.lesson1 );

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

            Lessons.get( { id: 'lesson1' } ).$promise
                .then( function ( object ) {
                    originalObject = object;
                } );

            $httpBackend.flush();

        } );

        describe( 'should send correct update request if I change', function () {

            var expectingDocument;

            beforeEach( function () {

                expectingDocument = documentsToRespond.lesson1;

            } );

            it( 'time', function () {

                expectingDocument.time.start.setDate( 9 );
                expectingDocument.time.end.setDate( 9 );

                expectingDocument.time.start.setHours( 15 );
                expectingDocument.time.end.setHours( 15 );

                expectingDocument.time.end.setMinutes( 40 );


                originalObject.time.date.setDate( 9 );
                originalObject.time.epochStart = 54000; // 15:00
                originalObject.time.duration = 40;


                defineRespond( 'PUT', 200, '/lessons/lesson1', expectingDocument );
                expectRequest( 'PUT', '/lessons/lesson1', expectingDocument );

                Lessons.update( { id: 'lesson1' }, originalObject );

                $httpBackend.flush();

            } );

            it( 'coaches', function () {

                expectingDocument.coaches = ['coach1', 'coach3'];

                originalObject.coaches = [
                    {
                        _id: 'coach1',
                        name: 'The Coach 1'
                    },
                    {
                        _id: 'coach3',
                        name: 'The Coach 3'
                    }
                ];


                defineRespond( 'PUT', 200, '/lessons/lesson1', expectingDocument );
                expectRequest( 'PUT', '/lessons/lesson1', expectingDocument );

                Lessons.update( { id: 'lesson1' }, originalObject );

                $httpBackend.flush();

            } );

            it( 'halls', function () {

                expectingDocument.halls = ['hall1', 'hall3'];

                originalObject.halls = [
                    {
                        _id: 'hall1',
                        name: 'The Hall 1'
                    },
                    {
                        _id: 'hall3',
                        name: 'The Hall 3'
                    }
                ];


                defineRespond( 'PUT', 200, '/lessons/lesson1', expectingDocument );
                expectRequest( 'PUT', '/lessons/lesson1', expectingDocument );

                Lessons.update( { id: 'lesson1' }, originalObject );

                $httpBackend.flush();

            } );

            it( 'groups', function () {

                expectingDocument.groups = ['group1', 'group3'];

                originalObject.groups = [
                    {
                        _id: 'group1',
                        name: 'The Group 1'
                    },
                    {
                        _id: 'group3',
                        name: 'The Group 3'
                    }
                ];


                defineRespond( 'PUT', 200, '/lessons/lesson1', expectingDocument );
                expectRequest( 'PUT', '/lessons/lesson1', expectingDocument );

                Lessons.update( { id: 'lesson1' }, originalObject );

                $httpBackend.flush();

            } );

        } );

        it( 'should call resolve with response data object as argument if all goes ok', function () {

            var objectToUpdate = {
                _id: 'lesson1',
                time: {
                    date: new Date( 2015, 5 - 1, 8 ),
                    epochStart: 50400,
                    duration: 30
                }
            };

            var expectedResponse = {
                _id: 'lesson1',
                time: {
                    start: new Date( 2015, 5-1, 8, 14, 0 ),
                    end: new Date( 2015, 5-1, 8, 14, 30 )
                },
                coaches: [],
                halls: [],
                groups: []
            };

            defineRespond( 'PUT', 200, '/lessons/lesson1', expectedResponse );

            Lessons.update( { id: 'lesson1' }, objectToUpdate ).$promise
                .then( callback.success, callback.error, callback.notify );

            $httpBackend.flush();

            expect( callback.success ).toHaveBeenCalled();
            expect( callback.error ).not.toHaveBeenCalled();
            expect( callback.notify ).not.toHaveBeenCalled();

            expect( callback.success.calls.mostRecent().args[0]._id ).toEqual( 'lesson1' );

        } );

        it( 'should call reject with error data object as argument if something goes wrong', function () {

            var objectToUpdate = {
                _id: 'lesson1',
                time: {
                    date: new Date( 2015, 5 - 1, 8 ),
                    epochStart: 50400,
                    duration: 30
                }
            };

            var errorObject = {
                statusText: 'some error message'
            };

            defineRespond( 'PUT', 500, '/lessons/lesson1', errorObject );

            Lessons.update( { id: 'lesson1' }, objectToUpdate ).$promise
                .then( callback.success, callback.error, callback.notify );

            $httpBackend.flush();

            expect( callback.success ).not.toHaveBeenCalled();
            expect( callback.error ).toHaveBeenCalled();
            expect( callback.notify ).not.toHaveBeenCalled();

            expect( callback.error.calls.mostRecent().args[0].status ).toEqual( 500 );

        } );

    } );

} );