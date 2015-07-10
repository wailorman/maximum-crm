describe( 'ApiHelper class', function () {

    var ApiHelper, $resource, $q, $httpBackend, $timeout,

        apiUri = 'http://api.max-crm.wailorman.ru:21080',

        callback = {
            error: function () {

            },
            success: function () {

            },
            notify: function () {

            }
        };


    var resetSpies = function () {

        callback.success.calls.reset();
        callback.error.calls.reset();
        callback.notify.calls.reset();

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


    beforeEach( module( 'starter.api.helper' ) );

    // injector
    beforeEach( inject( function ( _ApiHelper_, _$resource_, _$q_, _$httpBackend_, _$timeout_ ) {

        ApiHelper = _ApiHelper_;
        $resource = _$resource_;
        $q = _$q_;
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;

    } ) );

    // define spies
    beforeEach( function () {
        spyOn( callback, 'error' );
        spyOn( callback, 'success' );
        spyOn( callback, 'notify' );
    } );

    // reset all spies
    beforeEach( function () {
        resetSpies();
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

            ApiHelper.populateArray( coachesResource, arrayToPopulate )
                .then( callback.success, callback.error );

            $httpBackend.flush();

            expectRequest( 'GET', '/coaches/coach1' );
            expectRequest( 'GET', '/coaches/coach2' );

            expect( callback.error ).not.toHaveBeenCalled();
            expect( callback.success ).toHaveBeenCalled();

        } );

        it( 'should call callback.success with array of populated coaches', function () {

            resetSpies();

            ApiHelper.populateArray( coachesResource, arrayToPopulate )
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

            ApiHelper.populateArray( coachesResource, arrayToPopulate )
                .then( callback.success, callback.error, callback.notify );

            $httpBackend.flush();

            expectRequest( 'GET', '/coaches/coach1' );
            expectRequest( 'GET', '/coaches/coach3' );

            expect( callback.notify ).toHaveBeenCalled();
            expect( callback.success ).toHaveBeenCalled();

            expect( callback.notify.calls.count() ).toEqual( 1 );
            expect( callback.notify.calls.mostRecent().args[0] instanceof HttpError ).toBeTruthy();
            expect( callback.notify.calls.mostRecent().args[0].status ).toEqual( 404 );

        } );

        it( 'should call callback.error and callback.notify if 2/2 objects responds with 404', function () {

            arrayToPopulate = ['coach3', 'coach4'];

            ApiHelper.populateArray( coachesResource, arrayToPopulate )
                .then( callback.success, callback.error, callback.notify );

            $httpBackend.flush();

            expectRequest( 'GET', '/coaches/coach3' );
            expectRequest( 'GET', '/coaches/coach4' );

            expect( callback.success ).not.toHaveBeenCalled();
            expect( callback.error ).toHaveBeenCalled();
            expect( callback.notify ).toHaveBeenCalled();

            expect( callback.notify.calls.count() ).toEqual( 2 );
            expect( callback.error.calls.count() ).toEqual( 1 );

            expect( callback.error.calls.mostRecent().args[0] instanceof Error ).toBeTruthy();
            expect( callback.error.calls.mostRecent().args[0].message ).toEqual( "Can't find any object" );

            // I wont check notify callback args bcz I've made sure it calls correctly in previous test

        } );

        it( 'should call notify with http error', function () {

            arrayToPopulate = ['coach3', 'coach4'];

            ApiHelper.populateArray( coachesResource, arrayToPopulate )
                .then( callback.success, callback.error, callback.notify );

            $httpBackend.flush();

            expectRequest( 'GET', '/coaches/coach3' );
            expectRequest( 'GET', '/coaches/coach4' );

            expect( callback.notify.calls.count() ).toEqual( 2 );
            expect( callback.notify.calls.mostRecent().args[0] instanceof HttpError ).toBeTruthy();
            expect( callback.notify.calls.mostRecent().args[0].status ).toEqual( 404 );

        } );

        it( 'should throw exception if resource is undefined', function () {

            expect( function () {

                ApiHelper.populateArray( undefined, ['1'] );

            } ).toThrow( new InvalidArgumentError( 'Missing resource argument' ) );

        } );

        it( 'should throw exception if resource._get does not exists', function () {

            delete coachesResource._get;

            expect( function () {

                ApiHelper.populateArray( coachesResource, ['1'] );

            } ).toThrow( new InvalidArgumentError( 'Missing resource._get method' ) );

        } );

        it( 'should throw exception if resource._get is not a function', function () {

            coachesResource._get = 'some string!';

            expect( function () {

                ApiHelper.populateArray( coachesResource, ['1'] );

            } ).toThrow( new InvalidArgumentError( 'Invalid resource._get method. Expected function, but got a string' ) );


        } );

        it( 'should call resolve with empty array if arrayOfIds is not defined', function () {

            ApiHelper.populateArray( coachesResource, undefined )
                .then( callback.success, callback.error, callback.notify );

            $timeout.flush();

            expect( callback.success ).toHaveBeenCalled();
            expect( callback.error ).not.toHaveBeenCalled();
            expect( callback.notify ).not.toHaveBeenCalled();

            expect( callback.success.calls.mostRecent().args[0] ).toEqual( [] );

        } );

    } );

    describe( 'depopulateArray', function () {

        var arrayOfObjects;

        it( 'should return empty array if we passing to him null', function () {

            var result = ApiHelper.depopulateArray( null );
            expect( result instanceof Array ).toBeTruthy();
            expect( result ).toEqual( [] );

        } );

        it( 'should convert array of objects with _id property to plane array', function () {

            arrayOfObjects = [
                { _id: 'coach1', name: 'The Coach 1' },
                { _id: 'coach2', name: 'The Coach 2' }
            ];

            var result = ApiHelper.depopulateArray( arrayOfObjects );

            expect( result.length ).toEqual( 2 );
            expect( result[0] ).toEqual( 'coach1' );
            expect( result[1] ).toEqual( 'coach2' );

        } );

        it( 'should ignore element if object does not have _id property', function () {

            arrayOfObjects = [
                { _id: 'coach1', name: 'The Coach 1' },
                { name: 'The Coach 2' }
            ];

            expect( ApiHelper.depopulateArray( arrayOfObjects ) ).toEqual( ['coach1'] );

        } );

        it( 'should works fine if we will pass array with objects which have only _id property', function () {

            arrayOfObjects = [
                { _id: 'coach1' },
                { _id: 'coach2' }
            ];

            expect( ApiHelper.depopulateArray( arrayOfObjects ) ).toEqual( ['coach1', 'coach2'] );

        } );

        it( 'should return [] if we will pass empty array to arguments', function () {

            arrayOfObjects = [];

            expect( ApiHelper.depopulateArray( arrayOfObjects ) ).toEqual( [] );

        } );

        it( 'should works fine if some elem of array is object and some elem is string', function () {

            arrayOfObjects = [
                { _id: 'coach1', name: 'The Coach 1' },
                'coach2'
            ];

            var result = ApiHelper.depopulateArray( arrayOfObjects );

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

            var result = ApiHelper.depopulateArray( arrayOfObjects );

            expect( result.length ).toEqual( 3 );
            expect( result[0] ).toEqual( 'coach1' );
            expect( result[1] ).toEqual( 'coach2' );
            expect( result[2] ).toEqual( 345 );

        } );

    } );

    describe( 'addObjectToArrayById()', function () {

        var resourceObject,
            expectedObjectToReceive = {
                coach1: {
                    _id: 'coach1',
                    name: 'The Coach 1'
                },
                coach2: {
                    _id: 'coach2',
                    name: 'The Coach 2'
                }
            };

        var resetResourceMethodsSpies = function () {

            resourceObject.get.calls.reset();
            resourceObject._get.calls.reset();

        };

        beforeEach( function () {

            resourceObject = {
                _get: function () {
                    var deferred = $q.defer();
                    return { $promise: deferred.promise };
                },
                get: function () {
                    var deferred = $q.defer();
                    return { $promise: deferred.promise };
                }
            };

            spyOn( resourceObject, '_get' ).and.callThrough();
            spyOn( resourceObject, 'get' ).and.callThrough();

            resetResourceMethodsSpies();

        } );

        describe( 'Resource argument', function () {

            it( 'should throw exception if we did not passed Resource', function () {

                expect( function () {

                    ApiHelper.addObjectToArrayById( null, [], '1' );

                } ).toThrow( new InvalidArgumentError( 'Invalid Resource. Expect object or function' ) );

            } );

            it( 'should throw exception if Resource object does not have _get() or get() method', function () {

                delete resourceObject.get;
                delete resourceObject._get;

                expect( function () {

                    ApiHelper.addObjectToArrayById( resourceObject, [], '1' );

                } ).toThrow( new InvalidArgumentError( 'Invalid Resource. Expect _get() or get() method in Resource object' ) );

            } );

            it( 'should use get() method if it only exist in Resource object', function () {

                delete resourceObject._get;

                expect( function () {

                    ApiHelper.addObjectToArrayById( resourceObject, [], '1' );

                    expect( resourceObject.get ).toHaveBeenCalled();

                } ).not.toThrow();

            } );

            it( 'should use _get() method if there are get() and _get() methods in Resource object', function () {

                // get() and _get() methods was passed in beforeEach block

                expect( function () {

                    ApiHelper.addObjectToArrayById( resourceObject, [], '1' );

                    expect( resourceObject._get ).toHaveBeenCalled();

                } ).not.toThrow();

            } );

            it( 'should call _get() with object { id: objectId } argument', function () {

                ApiHelper.addObjectToArrayById( resourceObject, [], '1' );

                expect( resourceObject._get.calls.mostRecent().args[0] ).toEqual( { id: '1' } );

            } );

            it( 'should call get() with object { id: objectId } argument', function () {

                delete resourceObject._get;

                ApiHelper.addObjectToArrayById( resourceObject, [], '1' );

                expect( resourceObject.get.calls.mostRecent().args[0] ).toEqual( { id: '1' } );

            } );

        } );

        describe( 'array argument', function () {

            it( 'should throw exception if array was not passed', function () {

                expect( function () {

                    ApiHelper.addObjectToArrayById( resourceObject, null, '1' );

                } ).toThrow( new InvalidArgumentError( 'Missing array' ) );

            } );

            it( 'should throw exception if array argument is not an array', function () {

                expect( function () {

                    ApiHelper.addObjectToArrayById( resourceObject, "some str", '1' );

                } ).toThrow( new InvalidArgumentError( 'Invalid array. Expect array, but got string' ) );

            } );

            it( 'should not throw exception if array argument is valid', function () {

                expect( function () {

                    ApiHelper.addObjectToArrayById( resourceObject, [], '1' );

                } ).not.toThrow();

            } );

        } );

        describe( 'objectId argument', function () {

            it( 'should throw exception if objectId was not passed', function () {

                expect( function () {

                    ApiHelper.addObjectToArrayById( resourceObject, [], null );

                } ).toThrow( new InvalidArgumentError( 'Missing objectId' ) );

            } );

            it( 'should throw exception if objectId has object type', function () {

                expect( function () {

                    ApiHelper.addObjectToArrayById( resourceObject, [], {} );

                } ).toThrow( new InvalidArgumentError( 'Invalid objectId. Expect string or number, but got object' ) );

            } );

            it( 'should works fine if number was passed to objectId', function () {

                expect( function () {

                    ApiHelper.addObjectToArrayById( resourceObject, [], 123 );

                } ).not.toThrow();

            } );

            it( 'should works fine if string was passed to objectId', function () {

                expect( function () {

                    ApiHelper.addObjectToArrayById( resourceObject, [], '123' );

                } ).not.toThrow();

            } );

        } );

        describe( 'common calling', function () {

            var testArray;

            beforeEach( function () {

                defineRespond( 'GET', 200, '/coaches/coach1', expectedObjectToReceive.coach1 );

                resourceObject = $resource( apiUri + '/coaches/:id' );

                testArray = [];

            } );

            it( 'should call /coaches/coach1', function () {

                expectRequest( 'GET', '/coaches/coach1' );

                ApiHelper.addObjectToArrayById( resourceObject, testArray, 'coach1' )
                    .then( callback.success, callback.error, callback.notify );

                $httpBackend.flush();

            } );

            it( 'should call resolve on success', function () {

                ApiHelper.addObjectToArrayById( resourceObject, testArray, 'coach1' )
                    .then( callback.success, callback.error, callback.notify );

                $httpBackend.flush();

                expect( callback.success ).toHaveBeenCalled();
                expect( callback.error ).not.toHaveBeenCalled();
                expect( callback.notify ).not.toHaveBeenCalled();

            } );

            it( 'should push object to passed !empty! array', function () {

                ApiHelper.addObjectToArrayById( resourceObject, testArray, 'coach1' )
                    .then( callback.success, callback.error, callback.notify );

                $httpBackend.flush();

                expect( callback.success.calls.mostRecent().args[0] instanceof Array ).toBeTruthy();
                expect( callback.success.calls.mostRecent().args[0].length ).toEqual( 1 );
                expect( callback.success.calls.mostRecent().args[0][0]._id ).toEqual( 'coach1' );
                expect( callback.success.calls.mostRecent().args[0][0].name ).toEqual( 'The Coach 1' );

            } );

            it( 'should correctly push new object to existent nonempty array', function () {

                testArray = [{
                    _id: 'coach0',
                    name: 'The Coach 0'
                }];

                ApiHelper.addObjectToArrayById( resourceObject, testArray, 'coach1' )
                    .then( callback.success, callback.error, callback.notify );

                $httpBackend.flush();

                expect( callback.success.calls.mostRecent().args[0] instanceof Array ).toBeTruthy();
                expect( callback.success.calls.mostRecent().args[0].length ).toEqual( 2 );
                expect( callback.success.calls.mostRecent().args[0][0]._id ).toEqual( 'coach0' );
                expect( callback.success.calls.mostRecent().args[0][0].name ).toEqual( 'The Coach 0' );
                expect( callback.success.calls.mostRecent().args[0][1]._id ).toEqual( 'coach1' );
                expect( callback.success.calls.mostRecent().args[0][1].name ).toEqual( 'The Coach 1' );


            } );

        } );

    } );

    describe( 'getUploadMethodByObject()', function () {

        var getUploadMethodByObject,
            mockedResource,
            mockedObject,
            uploadMethod;

        var resetUploadMethodSpies = function () {

            mockedResource._create.calls.reset();
            mockedResource._update.calls.reset();

        };

        beforeEach( function () {

            getUploadMethodByObject = ApiHelper.getUploadMethodByObject;

            mockedResource = {
                _create: function () {

                },
                _update: function () {

                }
            };

            spyOn( mockedResource, '_create' ).and.callThrough();
            spyOn( mockedResource, '_update' ).and.callThrough();

            mockedObject = {
                $resolved: true,
                _id: 'some-id'
            };

            resetUploadMethodSpies();

        } );

        describe( 'should throw exception if', function () {

            it( '$resolved is not defined', function () {

                delete mockedObject.$resolved;

                expect( function () {

                    getUploadMethodByObject( mockedResource, mockedObject );

                } ).toThrow( new Error( 'Missing $resolved property in object' ) );

            } );

            it( '$resolved is a string var (cause its not boolean)', function () {

                mockedObject.$resolved = 'some string';

                expect( function () {

                    getUploadMethodByObject( mockedResource, mockedObject );

                } ).toThrow( new Error( 'Invalid object.$resolved type. Expected boolean, but got a string' ) );

            } );

            it( 'Resource does not have _create method', function () {

                delete mockedResource._create;

                expect( function () {

                    getUploadMethodByObject( mockedResource, mockedObject );

                } ).toThrow( new Error( 'Missing _create() method in Resource object' ) );

            } );

            it( 'Resource does not have _update method', function () {

                delete mockedResource._update;

                expect( function () {

                    getUploadMethodByObject( mockedResource, mockedObject );

                } ).toThrow( new Error( 'Missing _update() method in Resource object' ) );

            } );

            it( 'Resource is a string var (cause its not object)', function () {

                mockedResource = 'some string';

                expect( function () {

                    getUploadMethodByObject( mockedResource, mockedObject );

                } ).toThrow( new Error( 'Invalid Resource type. Expected object, but got a string' ) );

            } );

            it( 'object is a string var (cause its not object)', function () {

                mockedObject = 'some string';

                expect( function () {

                    getUploadMethodByObject( mockedResource, mockedObject );

                } ).toThrow( new Error( 'Invalid object type. Expected object, but got a string' ) );

            } );

            it( 'this is resolved object and it has not _id property', function () {
                // because we should have an _id property to build
                // correct upload (PUT) request!

                mockedObject.$resolved = true;
                delete mockedObject._id;

                expect( function () {

                    getUploadMethodByObject( mockedResource, mockedObject );

                } ).toThrow( new Error( 'Invalid object. Missing _id property since object is resolved' ) );

            } );

        } );

        it( 'should call _create method if $resolved = false', function () {

            mockedObject.$resolved = false;

            uploadMethod = getUploadMethodByObject( mockedResource, mockedObject );

            uploadMethod();

            expect( mockedResource._create ).toHaveBeenCalled();
            expect( mockedResource._update ).not.toHaveBeenCalled();

            expect( mockedResource._create ).toHaveBeenCalledWith( mockedObject );

        } );

        it( 'should call _update method if $resolved = true with params', function () {

            mockedObject.$resolved = true;

            uploadMethod = getUploadMethodByObject( mockedResource, mockedObject );

            uploadMethod();

            expect( mockedResource._create ).not.toHaveBeenCalled();
            expect( mockedResource._update ).toHaveBeenCalled();

            expect( mockedResource._update ).toHaveBeenCalledWith( { id: mockedObject._id }, mockedObject );

        } );

    } );

} );