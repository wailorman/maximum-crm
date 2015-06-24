angular.module( 'starter.api.coaches', [
    'ngResource'
] )
    .factory( 'Coaches', function ( $resource ) {

        var apiUrl = 'http://api.max-crm.wailorman.ru:21080';

        return $resource( apiUrl + '/coaches/:id', null, {
            'get': { method: 'GET', timeout: 5000 },
            'query': { method: 'GET', isArray: true, timeout: 5000 },
            'update': { method: 'PUT', timeout: 5000 },
            'create': { method: 'POST', timeout: 5000 },
            'remove': { method: 'DELETE', timeout: 5000 }
        } );

    } );