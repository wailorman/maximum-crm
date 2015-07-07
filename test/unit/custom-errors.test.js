describe( 'Custom Error objects', function () {

    describe( 'HttpError', function () {

        var newHttpError;

        it( 'should initiate as timeout error if no args', function () {

            newHttpError = new HttpError();

            expect( newHttpError.status ).toEqual( 0 );
            expect( newHttpError.statusText ).toEqual( "" );
            expect( newHttpError.config ).toEqual( {} );
            expect( newHttpError.data ).toEqual( {} );

        } );

        it( 'should be an instance of Error & HttpError', function () {

            newHttpError = new HttpError();

            expect( newHttpError instanceof Error ).toBeTruthy();
            expect( newHttpError instanceof HttpError ).toBeTruthy();

        } );

        it( 'should receive error params', function () {

            newHttpError = new HttpError(
                404,
                'NotFoundError',
                { headers: { 'X-Token': 'abc123' } },
                { text: 'NotFoundError' }
            );

            expect( newHttpError.status ).toEqual( 404 );
            expect( newHttpError.statusText ).toEqual( 'NotFoundError' );
            expect( newHttpError.config ).toEqual( { headers: { 'X-Token': 'abc123' } } );
            expect( newHttpError.data ).toEqual( { text: 'NotFoundError' } );

        } );

        it( 'should have message which describes status & statusText', function () {

            // with url

            newHttpError = new HttpError(
                404,
                'NotFoundError',
                { headers: { 'X-Token': 'abc123' }, url: 'http://wailorman.ru/whole-all' },
                { text: 'NotFoundError' }
            );

            expect( newHttpError.message ).toEqual( 'http://wailorman.ru/whole-all: 404 NotFoundError' );

            // without

            newHttpError = new HttpError(
                404,
                'NotFoundError',
                { headers: { 'X-Token': 'abc123' } },
                { text: 'NotFoundError' }
            );

            expect( newHttpError.message ).toEqual( '404 NotFoundError' );

        } );

    } );

} );