describe( 'populate directive', function () {

    var element, $rootScope, $scope, $compile, ResourceCache, elem;

    beforeEach( module( 'starter.populate' ) );

    beforeEach( inject( function ( _$rootScope_, _$compile_, _ResourceCache_ ) {

        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $compile = _$compile_;
        ResourceCache = _ResourceCache_;

        ResourceCache.put(
            'coaches/first',
            {
                name: 'First coach',
                anotherField: 'first value'
            }
        );

        ResourceCache.put(
            'coaches/second',
            {
                name: 'Second coach',
                anotherField: 'second value'
            }
        );

    } ) );

    var compileElement = function ( html ) {

        var element = $compile( html )( $scope );

        $rootScope.$digest();

        return element;

    };

    it( 'should display label', function () {

        elem = compileElement(
            '<item populate-view item-label="Coach"></item>'
        );

        expect( elem.html() ).toContain( 'Coach' );

    } );

    /////////////////////////////////////////////////////

    it( 'should populate existing object by string key', function () {

        $scope.theCoach = 'first';

        elem = compileElement(
            '<item populate-view resource-type="coaches" population-key="theCoach"></item>'
        );

        expect( elem.html() ).toContain( 'First coach' );
    } );

    it( 'should not populate nonexistent object by string key', function () {

        $scope.theCoach = 'third';

        elem = compileElement(
            '<item populate-view resource-type="coaches" population-key="theCoach"></item>'
        );

        expect( elem.html() ).toEqual( '' );

    } );

} );