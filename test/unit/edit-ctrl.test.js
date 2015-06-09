fdescribe( 'EditCtrl controller', function () {

    var $scope, EditCtrl;

    beforeEach( module( 'starter' ) );

    beforeEach( inject( function ( _$rootScope_, $controller ) {

        $scope = _$rootScope_.$new();

        //var $state = _$state_;

        var additionalStateParamsMock = {
            resourceType: 'Lessons'
        };

        var EditCtrl = $controller( 'EditCtrl', {
            $scope: $scope,
            additionalStateParams: additionalStateParamsMock
        } );

    } ) );

    it( 'sdfghg', function () {

        expect( 1 ).toEqual( 1 );

    } );

} );