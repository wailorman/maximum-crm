describe( 'resourceCache directive', function () {

    var element, $rootScope, scope, $compile, testGroupId, testClientId, $resource, ResourceCache;

    var failTest = function ( err ) {
        expect( err ).not.toBeDefined();
    };

    beforeEach( module( 'starter.resource-cache' ) );
    beforeEach( module( 'starter.api' ) );

    var tpls = {
        /**
         *
         * @param params
         * @param params.resourceType
         * @param params.resourceId
         * @param params.field
         * @param params.expectedValue
         */
        compileElement: function ( params ) {

            var html;

            html = '<resource-cache resource-type="' + params.resourceType + '" resource-id="cacheResourceId"';
            if ( params.field ) html += ' field="' + params.field + '"';
            html += '></resource-cache>';

            $rootScope.cacheResourceId = params.resourceId;

            element = $compile( html )( $rootScope );

            $rootScope.$digest();

            if ( params.expectedValue === '' )
                expect( element.html() ).toEqual( '' );
            else
                expect( element.html() ).toContain( params.expectedValue );

            return element;

        }
    };

    beforeEach( inject( function ( _$rootScope_, _$compile_, _ResourceCache_ ) {

        scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        ResourceCache = _ResourceCache_;

        ResourceCache.put(
            'coaches/named',
            {
                name: 'SomeName'
            }
        );

        ResourceCache.put(
            'coaches/some-object',
            {
                someField: 'SomeValue'
            }
        );

    } ) );

    describe( 'should be compiled if', function () {

        console.log( '2' );

        it( 'passed resourceType, resourceId', function () {

            tpls.compileElement( {
                resourceType: 'coaches',
                resourceId: 'named',
                expectedValue: 'SomeName'
            } );

        } );

        it( 'passed resourceType, field, resourceId', function () {

            tpls.compileElement( {
                resourceType: 'coaches',
                field: 'someField',
                resourceId: 'some-object',
                expectedValue: 'SomeValue'
            } );

        } );

    } );

    describe( 'should be empty if', function () {

        it( 'passed resourceType', function () {

            tpls.compileElement( {
                resourceType: 'coaches',
                expectedValue: ''
            } );

        } );

        it( 'passed resourceType and resourceId, but object has not the name field', function () {

            tpls.compileElement( {
                resourceType: 'coaches',
                resourceId: 'some-object',
                expectedValue: ''
            } );

        } );

        it( 'passed resourceType and resourceId, but such object does not exist', function () {

            tpls.compileElement( {
                resourceType: 'coaches',
                resourceId: 'nonexistent',
                expectedValue: ''
            } );

        } );

        it( 'passed resourceType, field, resourceId, but object has not passed field', function () {

            tpls.compileElement( {
                resourceType: 'coaches',
                field: 'undeclaredField',
                resourceId: 'named',
                expectedValue: ''
            } );

        } );

    } );

} );