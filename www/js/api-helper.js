angular.module( 'starter.api.helper', [
    'ngResource',
    'starter.api.interceptors'
] )

    .service( 'ApiHelper', function ( $q, $log ) {

        var ApiHelper = this;

        /**
         * Get populated array by array of IDs.
         * Async function
         *
         * Method don't stop working if it can't find some of objects.
         * On every error response (e.g. 404) it will call deferred.notify.
         * So, if it can't find two objects, it will calls notify function twice.
         * But! If method can't find all of requested objects it will call reject
         *
         * So
         * notify -- calls on every error
         * reject -- calls only if all requests respond an error
         * resolve -- calls after all requests been responded. Args: resultArray (already populated)
         *
         * @todo Get rid of rejecting
         *
         * @throws {InvalidArgumentError} Missing resource argument
         * @throws {InvalidArgumentError} Missing resource._get method
         * @throws {InvalidArgumentError} Invalid resource._get method. Expected function, but got a [type]
         *
         * @param {Resource} resource Should have _get() func!
         * @param {function} resource._get
         * @param {Array} arrayOfIds
         *
         * @return {Promise.<Array.<Object>,Error,HttpError>|*}
         * Resolve populated array.
         * Notice every time when method can't find some objects from array.
         * Reject if no objects from array were found.
         */
        ApiHelper.populateArray = function ( resource, arrayOfIds ) {
            var deferred = $q.defer(),
                resultArray = [],
                numberOfErrorResponds = 0;

            if ( !resource )
                throw new InvalidArgumentError( 'Missing resource argument' );

            if ( !resource._get )
                throw new InvalidArgumentError( 'Missing resource._get method' );

            if ( typeof resource._get !== 'function' )
                throw new InvalidArgumentError( 'Invalid resource._get method. Expected function, but got a ' + typeof resource._get );

            if ( !arrayOfIds ) {
                deferred.resolve( [] ); // if we got an empty array, there is nothing to populate!
            } else {
                async.each(
                    arrayOfIds,
                    function ( objectId, ecb ) {

                        resource._get( { id: objectId } ).$promise
                            .then(
                            function ( coach ) {
                                resultArray.push( coach );
                                ecb();
                            },
                            function ( error ) {
                                numberOfErrorResponds++;
                                deferred.notify( error );
                                ecb();
                            }
                        );

                    },
                    function () {
                        if ( numberOfErrorResponds == arrayOfIds.length ) {
                            deferred.reject( new Error( "Can't find any object" ) );
                        } else if ( numberOfErrorResponds < arrayOfIds.length && resultArray ) {
                            deferred.resolve( resultArray );
                        }
                    }
                );
            }

            return deferred.promise;
        };


        /**
         * Depopulate array.
         * Converting array of objects to plane array.
         * Sync function
         *
         * @param {Array} arrayOfObjects Elements of this array can be objects (with _id property!), strings and numbers
         *
         * @return {Array}
         */
        ApiHelper.depopulateArray = function ( arrayOfObjects ) {

            var resultArray = [];

            if ( arrayOfObjects ) { // if we got an empty array, depopulate is complete! :)

                arrayOfObjects.forEach( function ( elem ) {

                    if ( typeof elem === 'object' ) {

                        if ( elem._id ) {
                            resultArray.push( elem._id );
                        } else {
                            $log.error( new InvalidArgumentError( 'Some object in array does not have _id property' ) );
                        }

                    } else if ( typeof elem === 'string' || typeof elem === 'number' ) {

                        resultArray.push( elem );

                    }

                } );

            }

            return resultArray;

        };


        /**
         * Add object from Resource to array asynchronously.
         *
         * Call resolve after success get and push. Calling with resulted array as argument
         * Call reject when Resource get receive with error. As argument -- response error data.
         *
         * @param {object|Resource} Resource    Angular Resource object. Should have _get() or get() method
         * @param {function} [Resource.get]
         * @param {function} [Resource._get]
         * @param {array|Array} arrayToPush
         * @param {string|number} objectId      id for searching
         *
         * @throws {Error} Invalid Resource. Expect object or function
         * @throws {Error} Invalid Resource. Expect _get() or get() method in Resource object
         * @throws {Error} Missing array
         * @throws {Error} Invalid array. Expect array, but got [type]
         * @throws {Error} Missing objectId
         * @throws {Error} Invalid objectId. Expect string or number, but got [type]
         */
        ApiHelper.addObjectToArrayById = function ( Resource, arrayToPush, objectId ) {

            var resourceMethodToCall,
                deferred = $q.defer();

            if ( !Resource || ( typeof Resource !== 'object' && typeof Resource !== 'function' ) )
                throw new Error( 'Invalid Resource. Expect object or function' );

            if ( !Resource._get && !Resource.get )
                throw new Error( 'Invalid Resource. Expect _get() or get() method in Resource object' );

            if ( !arrayToPush )
                throw new Error( 'Missing array' );

            if ( !( arrayToPush instanceof Array ) )
                throw new Error( 'Invalid array. Expect array, but got ' + typeof arrayToPush );

            if ( !objectId )
                throw new Error( 'Missing objectId' );

            if ( typeof objectId !== 'string' && typeof objectId !== 'number' )
                throw new Error( 'Invalid objectId. Expect string or number, but got ' + typeof objectId );


            if ( Resource._get && typeof Resource._get === 'function' ) {

                resourceMethodToCall = Resource._get;

            } else if ( Resource.get && typeof Resource.get === 'function' ) {

                resourceMethodToCall = Resource.get;

            }

            resourceMethodToCall( { id: objectId } ).$promise
                .then( function ( data ) {

                    arrayToPush.push( data );
                    deferred.resolve( arrayToPush );

                }, deferred.reject );

            return deferred.promise;

        };

        /**
         * Helpful in developing Resource instance methods.
         * Especially I've create this method for own $save instance method.
         * It get Resource object which should have $resolved property. And if
         * $resolved == true, it means that this object has been received from server
         * and $save should send PUT request. Otherwise if $resolved == false it
         * means that this object haven't been defined in server and we should
         * create some new object by sending POST request.
         *
         * Resource object should have _create and _update method
         * object should have $resolved property and _id property if $resolved == true
         *
         * @param {object|Resource}     Resource
         * @param {function}            Resource._create
         * @param {function}            Resource._update
         * @param {object}              object
         * @param {boolean}             object.$resolved
         *
         * @throws Invalid [arg_name] type. Expected [expected_type], but got a [real_type]
         * @throws Missing $resolved property in object
         * @throws Missing [method_name] property in Resource object
         *
         * @return {Function}
         */
        ApiHelper.getUploadMethodByObject = function ( Resource, object ) {

            if ( typeof object !== 'object' )
                throw new Error( 'Invalid object type. Expected object, but got a ' + typeof object );

            if ( typeof Resource !== 'object' )
                throw new Error( 'Invalid Resource type. Expected object, but got a ' + typeof Resource );


            if ( !object.hasOwnProperty( '$resolved' ) )
                throw new Error( 'Missing $resolved property in object' );

            if ( typeof object.$resolved !== 'boolean' )
                throw new Error( 'Invalid object.$resolved type. Expected boolean, but got a ' + typeof object.$resolved );

            if ( object.$resolved === true && ! object.hasOwnProperty( '_id' ) )
                throw new Error( 'Invalid object. Missing _id property since object is resolved' );


            if ( !Resource._create )
                throw new Error( 'Missing _create() method in Resource object' );

            if ( !Resource._update )
                throw new Error( 'Missing _update() method in Resource object' );


            if ( object.$resolved === false ) { // _create

                return function () {
                    return Resource._create( object );
                };

            } else { // _update

                return function () {
                    return Resource._update( { id: object._id }, object );
                };

            }

        };

    } );