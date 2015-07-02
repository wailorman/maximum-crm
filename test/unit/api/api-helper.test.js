fdescribe( 'ApiHelper class', function () {

    var ApiHelper, $resource, $q, $httpBackend,

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
    beforeEach( inject( function ( _ApiHelper_, _$resource_, _$q_, _$httpBackend_ ) {

        ApiHelper = _ApiHelper_;
        $resource = _$resource_;
        $q = _$q_;
        $httpBackend = _$httpBackend_;

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

            resetSpies();

            ApiHelper.populateArray( coachesResource, arrayToPopulate )
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

            expect( callback.error.calls.mostRecent().args[0] ).toEqual( "Can't find any object" );

            // I wont check notify callback args bcz I made sure it calls correctly in previous test

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

} );