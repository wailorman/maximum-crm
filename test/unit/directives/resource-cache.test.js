describe( 'resourceCache directive', function () {

    var element, scope, _compile, testGroupId, testClientId, $resource;

    var failTest = function ( err ) {
        expect( err ).not.toBeDefined();
    };

    //var apiUri = 'http://api.max-crm.wailorman.ru:21080';

    beforeEach( module( 'starter.resource-cache' ) );
    beforeEach( module( 'starter.api' ) );
    //beforeEach( module( 'ngResource' ) );

    var tpls = {
        /**
         *
         * @param params
         * @param params.resourceType
         * @param params.resourceId
         * @param params.field
         */
        compileElement: function ( params ) {

            var html;

            expect( params.resourceType ).toBeDefined();
            expect( params.resourceId ).toBeDefined();

            html = '<resource-cache resource-type="' + params.resourceType + '" resource-id="' + params.resourceId + '"';
            if ( params.field ) html += ' field="' + params.field + '"';
            html += '></resource-cache>';

            element = _compile( html )( scope );
            scope.$digest();

            return element;

        }
    };

    it( 'should create test resources', function ( done ) {


        inject( function ( _Api_, $httpBackend, $injector ) {

            $resource = $injector.get('$resource');

            $resource( 'http://api.max-crm.wailorman.ru:21080/' )

        });

            //async.waterfall( [
            //
            //    function ( wcb ) {

            // expect to successfully create a new group

            //_Api_.Groups.create( {}, { name: 'Resource cache test group' } ).$promise

                //newGroup.name = 'Resource cache test group';
                //newGroup.$save()
                //    .catch( failTest )
                //.then( function ( createdGroup ) {

                    //expect( createdGroup._id ).toBeDefined();
                    //testGroupId = createdGroup._id;
                    //wcb( createdGroup._id );

                    //done();

                    //} );

                    //},

                    //function ( newGroupId, wcb ) {

                    // expect to success create a new client

                    //_Api_.Clients.create( {}, { name: 'Resource cache test client', consists: [newGroupId] } ).$promise

                    //newClient.name = 'Resource cache test client';
                    //newClient.consists = [newGroupId];
                    //newClient.$save()
                    //    .catch( failTest )
                    //            .then( function ( createdClient ) {
                    //
                    //                expect( createdClient._id ).toBeDefined();
                    //                testClientId = createdClient._id;
                    //                wcb();
                    //
                    //            } );
                    //
                    //    }
                    //
                    //], function () {
                    //    done();
                    //} );


                //} );

        //} );
    } );


    beforeEach( inject( function ( $rootScope, $compile ) {

        scope = $rootScope.$new();
        _compile = $compile;

    } ) );

    describe( 'should compile if', function () {

        it( 'passed resourceType and resourceId. should display name', function () {

            tpls.compileElement( {
                resourceType: 'groups',
                resourceId: testGroupId
            } );

            expect( element.html() ).toEqual( 'Resource cache test group' );

        } );

    } );

} );