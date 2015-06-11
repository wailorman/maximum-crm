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
            start: new Date((new Date()).setHours( 10 )),
            end: new Date((new Date()).setHours( 11 ))
        };

    beforeEach( function () {
        spyOn( callback, 'error' );
        spyOn( callback, 'success' );
    } );

    beforeEach( module( 'starter.api' ) );

    beforeEach( inject( function ( _$httpBackend_, _Api_ ) {

        Api = _Api_;
        $httpBackend = _$httpBackend_;

        // coaches

        defineRespond( 'GET', 200, '/coaches/coach1', {
            _id: 'coach1',
            name: 'coach1'
        } );

        defineRespond( 'GET', 200, '/coaches/coach2', {
            _id: 'coach2',
            name: 'coach2'
        } );

        defineRespond( 'GET', 404, '/coaches/coach3', {} );

        // groups

        defineRespond( 'GET', 200, '/groups/group1', {
            _id: 'group1',
            name: 'group1'
        } );

        defineRespond( 'GET', 200, '/groups/group2', {
            _id: 'group2',
            name: 'group2'
        } );

        defineRespond( 'GET', 404, '/groups/group3', {} );

        // halls

        defineRespond( 'GET', 200, '/halls/hall1', {
            _id: 'hall1',
            name: 'hall1'
        } );

        defineRespond( 'GET', 200, '/halls/hall2', {
            _id: 'hall2',
            name: 'hall2'
        } );

        defineRespond( 'GET', 404, '/halls/hall3', {} );

    } ) );

    var defineRespond = function ( method, status, path, data ) {

        $httpBackend.when( method, apiUri + path )
            .respond( status, data, {} );

    };

    var expectRequest = function ( method, path, data ) {

        $httpBackend.expect( method, apiUri + path, data );

    };

    describe( 'get object', function () {

        it( 'should request a lesson from API', function () {

            expectRequest( 'GET', '/lessons/lesson1' );

            defineRespond( 'GET', 200, '/lessons/lesson1', {
                _id: 'lesson1',
                time: mockedTime
            } );

            Api.Lessons.get( { id: 'lesson1' } ).$promise
                .then( callback.success, callback.error );

            $httpBackend.flush();

            expect( callback.error ).not.toHaveBeenCalled();
            expect( callback.success ).toHaveBeenCalled();

        } );

        it( 'should work without any properties except _id', function () {

            defineRespond( 'GET', 200, '/lessons/lesson1', {
                _id: 'lesson1'
            } );

            Api.Lessons.get( { id: 'lesson1' } ).$promise
                .then( callback.success, callback.error );

            $httpBackend.flush();

            expect( callback.error ).not.toHaveBeenCalled();
            expect( callback.success ).toHaveBeenCalled();

            expect( callback.success.calls.mostRecent().args[ 0 ]._id ).toEqual( 'lesson1' );

        } );

        it( 'should return an error if there is no _id property or document is empty', function () {

            defineRespond( 'GET', 200, '/lessons/lesson1', {} );

            Api.Lessons.get( { id: 'lesson1' } ).$promise
                .then( callback.success, callback.error );

            $httpBackend.flush();

            expect( callback.success ).not.toHaveBeenCalled();
            expect( callback.error ).toHaveBeenCalled();

        } );

        describe( 'time', function () {

            var startTime, endTime, receivedObject;

            beforeEach( function () {

                startTime = new Date();
                endTime = new Date();

                startTime.setDate( 25 );
                startTime.setMonth( 5-1 );
                startTime.setFullYear( 2015 );

                endTime.setDate( 25 );
                endTime.setMonth( 5-1 );
                endTime.setFullYear( 2015 );

                startTime.setHours( 14 );
                startTime.setMinutes( 0 );
                startTime.setSeconds( 0 );
                startTime.setMilliseconds( 0 );

                endTime.setHours( 14 );
                endTime.setMinutes( 35 );
                endTime.setSeconds( 0 );
                endTime.setMilliseconds( 0 );

                defineRespond( 'GET', 200, '/lessons/time-lesson', {
                    _id: 'time-lesson',
                    time: {
                        start: startTime,
                        end: endTime
                    }
                } );

                ///////////

                Api.Lessons.get( {id: 'time-lesson'} ).$promise
                    .then( callback.success, callback.error );

                $httpBackend.flush();

                expect( callback.error ).not.toHaveBeenCalled();
                expect( callback.success ).toHaveBeenCalled();

                receivedObject = callback.success.calls.mostRecent().args[ 0 ];

            } );

            describe( 'date', function () {

                it( 'should be an instance of Date', function () {

                    expect( receivedObject.time.date ).toBeDefined();
                    expect( receivedObject.time.date instanceof Date ).toBeTruthy();

                } );

                it( 'should have the same day, month, year with time.start', function () {

                    expect( receivedObject.time.date.getDate() ).toEqual( 25 );
                    expect( receivedObject.time.date.getMonth() ).toEqual( 5-1 );
                    expect( receivedObject.time.date.getFullYear() ).toEqual( 2015 );

                } );

                it( 'should be with 0 hours, minutes, seconds and milliseconds', function () {

                    expect( receivedObject.time.date.getHours() ).toEqual( 0 );
                    expect( receivedObject.time.date.getMinutes() ).toEqual( 0 );
                    expect( receivedObject.time.date.getSeconds() ).toEqual( 0 );
                    expect( receivedObject.time.date.getMilliseconds() ).toEqual( 0 );

                } );

            } );

            describe( 'epochStart', function () {

                /** @namespace receivedObject.time.epochStart */

                it( 'should be a number', function () {

                    expect( receivedObject.time.epochStart ).toBeDefined();
                    expect( typeof receivedObject.time.epochStart ).toEqual( 'number' );

                } );

                it( 'should equal number of passed seconds from the start of the day', function () {

                    expect( receivedObject.time.epochStart ).toEqual( 50400 );

                } );

            } );

            describe( 'duration', function () {

                /** @namespace receivedObject.time.duration */

                it( 'should be a number', function () {

                    expect( receivedObject.time.duration ).toBeDefined();
                    expect( typeof receivedObject.time.duration ).toEqual( 'number' );

                } );

                it( 'should equal number of minutes lesson long', function () {

                    expect( receivedObject.time.duration ).toEqual( 35 );

                } );

            } );

        } );

        describe( 'coaches population', function () {

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

                expectRequest( 'GET', '/coaches/coach1' );
                expectRequest( 'GET', '/coaches/coach3' );

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

        describe( 'groups population', function () {

            it( 'should populate groups', function () {

                expectRequest( 'GET', '/groups/group1' );
                expectRequest( 'GET', '/groups/group2' );

                defineRespond( 'GET', 200, '/lessons/lesson2', {
                    _id: 'lesson2',
                    time: mockedTime,
                    groups: [ 'group1', 'group2' ]
                } );

                Api.Lessons.get( { id: 'lesson2' } ).$promise
                    .then( callback.success, callback.error );

                $httpBackend.flush();

                expect( callback.success ).toHaveBeenCalled();
                expect( callback.error ).not.toHaveBeenCalled();

                expect( callback.success.calls.mostRecent().args[ 0 ].groups[ 0 ]._id ).toEqual( 'group1' );
                expect( callback.success.calls.mostRecent().args[ 0 ].groups[ 0 ].name ).toEqual( 'group1' );
                expect( callback.success.calls.mostRecent().args[ 0 ].groups[ 1 ]._id ).toEqual( 'group2' );
                expect( callback.success.calls.mostRecent().args[ 0 ].groups[ 1 ].name ).toEqual( 'group2' );

            } );

            it( 'should ignore groups if there is no', function () {

                defineRespond( 'GET', 200, '/lessons/lesson2', {
                    _id: 'lesson2',
                    time: mockedTime
                } );

                Api.Lessons.get( { id: 'lesson2' } ).$promise
                    .then( callback.success, callback.error );

                $httpBackend.flush();

                expect( callback.success ).toHaveBeenCalled();
                expect( callback.error ).not.toHaveBeenCalled();

                expect( callback.success.calls.mostRecent().args[ 0 ].groups ).toBeUndefined();

            } );

            it( 'should ignore populating nonexistent group', function () {

                expectRequest( 'GET', '/groups/group1' );
                expectRequest( 'GET', '/groups/group3' );

                defineRespond( 'GET', 200, '/lessons/lesson2', {
                    _id: 'lesson2',
                    time: mockedTime,
                    groups: [ 'group1', 'group3' ]
                } );

                Api.Lessons.get( { id: 'lesson2' } ).$promise
                    .then( callback.success, callback.error );

                $httpBackend.flush();

                expect( callback.success ).toHaveBeenCalled();
                expect( callback.error ).not.toHaveBeenCalled();

                expect( callback.success.calls.mostRecent().args[ 0 ].groups.length ).toBe( 1 );
                expect( callback.success.calls.mostRecent().args[ 0 ].groups[ 0 ]._id ).toBe( 'group1' );

            } );

        } );

        describe( 'halls population', function () {

            it( 'should populate halls', function () {

                expectRequest( 'GET', '/halls/hall1' );
                expectRequest( 'GET', '/halls/hall2' );

                defineRespond( 'GET', 200, '/lessons/lesson2', {
                    _id: 'lesson2',
                    time: mockedTime,
                    halls: [ 'hall1', 'hall2' ]
                } );

                Api.Lessons.get( { id: 'lesson2' } ).$promise
                    .then( callback.success, callback.error );

                $httpBackend.flush();

                expect( callback.success ).toHaveBeenCalled();
                expect( callback.error ).not.toHaveBeenCalled();

                expect( callback.success.calls.mostRecent().args[ 0 ].halls[ 0 ]._id ).toEqual( 'hall1' );
                expect( callback.success.calls.mostRecent().args[ 0 ].halls[ 0 ].name ).toEqual( 'hall1' );
                expect( callback.success.calls.mostRecent().args[ 0 ].halls[ 1 ]._id ).toEqual( 'hall2' );
                expect( callback.success.calls.mostRecent().args[ 0 ].halls[ 1 ].name ).toEqual( 'hall2' );

            } );

            it( 'should ignore halls if there is no', function () {

                defineRespond( 'GET', 200, '/lessons/lesson2', {
                    _id: 'lesson2',
                    time: mockedTime
                } );

                Api.Lessons.get( { id: 'lesson2' } ).$promise
                    .then( callback.success, callback.error );

                $httpBackend.flush();

                expect( callback.success ).toHaveBeenCalled();
                expect( callback.error ).not.toHaveBeenCalled();

                expect( callback.success.calls.mostRecent().args[ 0 ].halls ).toBeUndefined();

            } );

            it( 'should ignore populating nonexistent hall', function () {

                expectRequest( 'GET', '/halls/hall1' );
                expectRequest( 'GET', '/halls/hall3' );

                defineRespond( 'GET', 200, '/lessons/lesson2', {
                    _id: 'lesson2',
                    time: mockedTime,
                    halls: [ 'hall1', 'hall3' ]
                } );

                Api.Lessons.get( { id: 'lesson2' } ).$promise
                    .then( callback.success, callback.error );

                $httpBackend.flush();

                expect( callback.success ).toHaveBeenCalled();
                expect( callback.error ).not.toHaveBeenCalled();

                expect( callback.success.calls.mostRecent().args[ 0 ].halls.length ).toBe( 1 );
                expect( callback.success.calls.mostRecent().args[ 0 ].halls[ 0 ]._id ).toBe( 'hall1' );

            } );

        } );

    } );

} );