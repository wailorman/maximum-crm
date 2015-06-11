describe( 'Api: Lessons', function () {

    var $httpBackend, Api,
        callback = {
            error: function () {

            },
            success: function () {

            }
        },
        apiUri = 'http://api.max-crm.wailorman.ru:21080',
        mockedTime = {
            start: (new Date()).setHours( 10 ),
            end: (new Date()).setHours( 11 )
        };

    beforeEach( function () {
        spyOn( callback, 'error' );
        spyOn( callback, 'success' );
    } );

    beforeEach( module( 'starter.api' ) );

    beforeEach( inject( function ( _$httpBackend_, _Api_ ) {

        Api = _Api_;
        $httpBackend = _$httpBackend_;

        defineRespond( 'GET', 200, '/coaches/coach1', {
            _id: 'coach1',
            name: 'coach1'
        } );

        defineRespond( 'GET', 200, '/coaches/coach2', {
            _id: 'coach2',
            name: 'coach2'
        } );

        defineRespond( 'GET', 404, '/coaches/coach3', {} );

    } ) );

    var defineRespond = function ( method, status, path, data ) {

        $httpBackend.when( method, apiUri + path )
            .respond( status, data, {} );

    };

    var expectRequest = function ( method, path, data ) {

        $httpBackend.expect( method, apiUri + path, data );

    };

    describe( 'GET', function () {

        it( 'should request a lesson from API', function () {

            expectRequest( 'GET', '/lessons/lesson1' );

            defineRespond( 'GET', 200, '/lessons/lesson1', {
                time: {
                    start: (new Date()).setHours( 10 ),
                    end: (new Date()).setHours( 11 )
                }
            } );

            Api.Lessons.get( { id: 'lesson1' } ).$promise
                .catch( callback.error )
                .then( callback.success );

            $httpBackend.flush();

            expect( callback.error ).not.toHaveBeenCalled();
            expect( callback.success ).toHaveBeenCalled();

        } );

        describe( 'coaches', function () {

            it( 'should populate coaches', function () {

                expectRequest( 'GET', '/coaches/coach1' );
                expectRequest( 'GET', '/coaches/coach2' );

                defineRespond( 'GET', 200, '/lessons/lesson2', {
                    _id: 'lesson2',
                    time: mockedTime,
                    coaches: [ 'coach1', 'coach2' ]
                } );

                Api.Lessons.get( { id: 'lesson2' } ).$promise
                    .then( callback.success, callback.error );

                $httpBackend.flush();

                expect( callback.success ).toHaveBeenCalled();
                expect( callback.error ).not.toHaveBeenCalled();

                expect( callback.success.calls.mostRecent().args[ 0 ].coaches[ 0 ]._id ).toEqual( 'coach1' );
                expect( callback.success.calls.mostRecent().args[ 0 ].coaches[ 0 ].name ).toEqual( 'coach1' );
                expect( callback.success.calls.mostRecent().args[ 0 ].coaches[ 1 ]._id ).toEqual( 'coach2' );
                expect( callback.success.calls.mostRecent().args[ 0 ].coaches[ 1 ].name ).toEqual( 'coach2' );

            } );

            it( 'should ignore coaches if there is no', function () {

                defineRespond( 'GET', 200, '/lessons/lesson2', {
                    _id: 'lesson2',
                    time: mockedTime
                } );

                Api.Lessons.get( { id: 'lesson2' } ).$promise
                    .then( callback.success, callback.error );

                $httpBackend.flush();

                expect( callback.success ).toHaveBeenCalled();
                expect( callback.error ).not.toHaveBeenCalled();

                expect( callback.success.calls.mostRecent().args[ 0 ].coaches ).toBeUndefined();

            } );

            it( 'should ignore populating nonexistent coach', function () {

                defineRespond( 'GET', 200, '/lessons/lesson2', {
                    _id: 'lesson2',
                    time: mockedTime,
                    coaches: [ 'coach1', 'coach3' ]
                } );

                Api.Lessons.get( { id: 'lesson2' } ).$promise
                    .then( callback.success, callback.error );

                $httpBackend.flush();

                expect( callback.success ).toHaveBeenCalled();
                expect( callback.error ).not.toHaveBeenCalled();

                expect( callback.success.calls.mostRecent().args[ 0 ].coaches.length ).toBe( 1 );
                expect( callback.success.calls.mostRecent().args[ 0 ].coaches[ 0 ]._id ).toBe( 'coach1' );

            } );

        } );

    } );

} );