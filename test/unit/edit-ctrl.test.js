fdescribe( 'EditCtrl controller', function () {

    var EditCtrlScope, EditCtrl;

    beforeEach( module( 'starter' ) );

    beforeEach( inject( function ( _$rootScope_, $controller ) {

        EditCtrlScope = _$rootScope_.$new();

        var additionalStateParamsMock = {
            resourceType: 'Lessons'
        };

        EditCtrl = $controller( 'EditCtrl', {
            $scope: EditCtrlScope,
            additionalStateParams: additionalStateParamsMock
        } );

    } ) );

    describe( 'getTimepickerTime()', function () {

        var theDate;

        beforeEach( function () {

            theDate = new Date();
            theDate.setHours( 0 );
            theDate.setMinutes( 0 );
            theDate.setSeconds( 0 );
            theDate.setMilliseconds( 0 );

        } );

        it( 'should return 0 if time 00:00', function () {

            theDate.setHours( 0 );
            theDate.setMinutes( 0 );

            expect( EditCtrlScope.getTimepickerTime( theDate ) ).toEqual( 0 );

        } );

        it( 'should return 3600 if time 01:00', function () {

            theDate.setHours( 1 );
            theDate.setMinutes( 0 );

            expect( EditCtrlScope.getTimepickerTime( theDate ) ).toEqual( 3600 );

        }  );

        it( 'should return 5400 if time 01:30', function () {

            theDate.setHours( 1 );
            theDate.setMinutes( 30 );

            expect( EditCtrlScope.getTimepickerTime( theDate ) ).toEqual( 5400 );

        }  );

        it( 'should return 7200 if time 02:00', function () {

            theDate.setHours( 2 );
            theDate.setMinutes( 0 );

            expect( EditCtrlScope.getTimepickerTime( theDate ) ).toEqual( 7200 );

        }  );

        it( 'should return 9000 if time 02:30', function () {

            theDate.setHours( 2 );
            theDate.setMinutes( 30 );

            expect( EditCtrlScope.getTimepickerTime( theDate ) ).toEqual( 9000 );

        }  );

        it( 'should do not forget about seconds. 00:00:01 should return 1', function () {

            theDate.setHours( 0 );
            theDate.setMinutes( 0 );
            theDate.setSeconds( 1 );

            expect( EditCtrlScope.getTimepickerTime( theDate ) ).toEqual( 1 );

        }  );

    } );

} );