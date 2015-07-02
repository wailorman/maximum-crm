angular.module( 'starter.api.helper', [
    'ngResource'
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
         * @param {Resource} resource Should have _get() func!
         * @param {array|Array} arrayOfIds
         */
        ApiHelper.populateArray = function ( resource, arrayOfIds ) {
            var deferred = $q.defer(),
                resultArray = [],
                numberOfErrorResponds = 0;

            async.each(
                arrayOfIds,
                function ( objectId, ecb ) {

                    resource._get( { id: objectId } ).$promise
                        .then(
                        function ( coach ) {
                            resultArray.push( coach );
                            ecb();
                        },
                        function () {
                            numberOfErrorResponds++;
                            deferred.notify( "Can't find " + objectId );
                            ecb();
                        }
                    );

                },
                function () {
                    if ( numberOfErrorResponds == arrayOfIds.length ) {
                        deferred.reject( "Can't find any object" );
                    } else if ( numberOfErrorResponds < arrayOfIds.length && resultArray ) {
                        deferred.resolve( resultArray );
                    }
                }
            );

            return deferred.promise;
        };


        /**
         * Depopulate array.
         * Converting array of objects to plane array.
         * Sync function
         *
         * @param {array|Array} arrayOfObjects Elements of this array can be objects (with _id property!), strings and numbers
         *
         * @return {array|Array}
         */
        ApiHelper.depopulateArray = function ( arrayOfObjects ) {

            var resultArray = [];

            if ( !arrayOfObjects ) {
                $log.error( 'Missing array' );
            } else {

                arrayOfObjects.forEach( function ( elem ) {

                    if ( typeof elem === 'object' ) {

                        if ( elem._id ) {
                            resultArray.push( elem._id );
                        } else {
                            $log.error( 'Some object in array does not have _id property' );
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
         * @param {array|Array} array
         * @param {string|number} objectId
         *
         * @throws Error( 'Invalid Resource. Expect object or function' )
         * @throws Error( 'Invalid Resource. Expect _get() or get() method in Resource object' )
         * @throws Error( 'Missing array' )
         * @throws Error( 'Invalid array. Expect array, but got <type>' )
         * @throws Error( 'Missing objectId' )
         * @throws Error( 'Invalid objectId. Expect string or number, but got <type>' )
         */
        ApiHelper.addObjectToArrayById = function ( Resource, array, objectId ) {

            var resourceMethodToCall,
                deferred = $q.defer();

            if ( !Resource || ( typeof Resource !== 'object' && typeof Resource !== 'function' ) )
                throw new Error( 'Invalid Resource. Expect object or function' );

            if ( !Resource._get && !Resource.get )
                throw new Error( 'Invalid Resource. Expect _get() or get() method in Resource object' );

            if ( !array )
                throw new Error( 'Missing array' );

            if ( !( array instanceof Array ) )
                throw new Error( 'Invalid array. Expect array, but got ' + typeof array );

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

                    array.push( data );
                    deferred.resolve( array );

                }, deferred.reject );

            return deferred.promise;

        };

    } );