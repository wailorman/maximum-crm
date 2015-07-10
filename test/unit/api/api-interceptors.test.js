describe( 'Api interceptors', function () {

    var httpErrorInterceptor, $httpBackend, $http, $q, $log, dependedObjects, $resource,
        apiUri   = 'http://api.max-crm.wailorman.ru:21080',
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

    beforeEach( module( 'starter.api.interceptors' ) );
    beforeEach( module( 'ngResource' ) );

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
    beforeEach( inject( function ( _httpErrorInterceptor_, _$httpBackend_, _$http_, _$resource_, _$q_, _$log_ ) {

        httpErrorInterceptor = _httpErrorInterceptor_;
        $httpBackend         = _$httpBackend_;
        $http                = _$http_;
        $resource            = _$resource_;
        $q                   = _$q_;
        $log                 = _$log_;

    } ) );


    beforeEach( function () {

        defineRespond( 'GET', 404, '/example', { desc: 'Some text' } );

    } );

    it( 'should convert default error object to HttpError', function () {

        expectRequest( 'GET', '/example' );

        $http.get( apiUri + '/example' )
            .then( callback.success, callback.error );

        $httpBackend.flush();

        expect( callback.success ).not.toHaveBeenCalled();
        expect( callback.error ).toHaveBeenCalled();

        var rejectedError = callback.error.calls.mostRecent().args[0];

        expect( rejectedError instanceof HttpError ).toBeTruthy();

        // default properties

        expect( rejectedError.status ).toEqual( 404 );
        expect( rejectedError.data.desc ).toEqual( 'Some text' );
        expect( rejectedError.name ).toEqual( 'HttpError' );
        expect( rejectedError.message ).toContain( '/example: 404' );

        // config

        expect( typeof rejectedError.config.headers ).toEqual( 'object' );
        expect( rejectedError.config.method ).toEqual( 'GET' );
        expect( typeof rejectedError.config.paramSerializer ).toEqual( 'function' );
        expect( rejectedError.config.transformRequest instanceof Array ).toBeTruthy();
        expect( rejectedError.config.transformResponse instanceof Array ).toBeTruthy();
        expect( rejectedError.config.url ).toEqual( apiUri + '/example' );


    } );

} );