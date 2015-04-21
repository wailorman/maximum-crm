describe( 'Client basics:', function () {


    it( 'should open clients', function () {

        browser.driver.get( 'http://192.168.0.60:8100/#/clients' );
        //browser.waitForAngular();

    } );

    it( 'should find list', function () {

        var list = element.all( by.repeater( 'item in items' ) );
        expect( list.isEnabled() ).toBeTruthy();

    } );

    describe( 'create:', function () {

        it( 'should find create button', function () {
            var addButton = element( by.css( '.ion-android-add' ) );
            expect( addButton.isEnabled() ).toBeTruthy();
        } );

        it( 'should click on create button and have correct title', function () {
            element( by.css( '.ion-android-add' ) ).click();
            var navBarTitle = element( by.css( '.nav-bar-title' ) ).getText();

            expect( navBarTitle ).toBe( 'Новый клиент' );
        } );

        it( 'should type new name', function () {

            var nameTextBox = element( by.model( 'data.name' ) );
            expect( nameTextBox.isDisplayed() ).toBeTruthy();

            nameTextBox.sendKeys( 'Random client' );

        } );

        it( 'should press create button', function () {

            var createButton = element( by.css( '.ion-android-done' ) );
            expect( createButton.isDisplayed() ).toBeTruthy();

            createButton.click();

            browser.sleep( 1000 );

        } );

        it( 'should redirect to list', function () {

            var currentUrl = browser.getLocationAbsUrl();
            expect( currentUrl ).toBe( '/clients' );

        } );

        it( 'should find new resource in list', function () {

            var lastElement = element.all( by.repeater( 'item in items' ) ).get( 0 );

            expect( lastElement.getText() ).toBe( 'Random client' );

        } );

    } );

    describe( 'view and edit:', function () {

        it( 'should open created resource', function () {

            var lastElement = element.all( by.repeater( 'item in items' ) ).get( 0 );
            lastElement.click();

            var currentUrl = browser.getLocationAbsUrl();
            expect( currentUrl ).toMatch( /[a-f0-9]{24}/ );

        } );

        it( 'should display name in view', function () {

            var name = element( by.binding( 'data.name' ) );
            expect( name.getText() ).toBe( 'Random client' );

        } );

        it( 'should find edit button', function () {

            var editButton = element( by.css( '.ion-android-create' ) );
            expect( editButton.isDisplayed() ).toBeTruthy();

        } );

        it( 'should go to edit page', function () {

            var editButton = element( by.css( '.ion-android-create' ) );
            editButton.click();

            var currentUrl = browser.getLocationAbsUrl();
            expect( currentUrl ).toMatch( /(\/edit)$/ );

        } );

        it( 'should show edit page', function () {

            browser.sleep(1000);

            var editNavDisplaying = element( by.buttonText( 'Редактирование' ) ).isDisplayed();
            expect( editNavDisplaying ).toBeTruthy();

        } );

        it( 'should display current resource name', function () {

            var name = element( by.binding( 'data.name' ) ).getText();
            expect( name ).toBe( 'Random client' );

        } );

        it( 'should edit name', function () {



        } );

    } );

} );