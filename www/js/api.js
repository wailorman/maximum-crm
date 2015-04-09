angular.module( 'starter.api', [] )
    .factory( 'Api', function ( $resource ) {

        var apiUrl = 'http://api.max-crm.wailorman.ru:21080';

        return {
            Coaches: $resource( apiUrl + '/coaches/:id', null, {
                'get': { method: 'GET' },
                'query': { method: 'GET', isArray: true },
                'update': { method: 'PUT' },
                'create': { method: 'POST' },
                'remove': { method: 'DELETE' }
            } ),
            Halls: $resource( apiUrl + '/halls/:id', null, {
                'get': { method: 'GET' },
                'query': { method: 'GET', isArray: true },
                'update': { method: 'PUT' },
                'create': { method: 'POST' },
                'remove': { method: 'DELETE' }
            } ),
            Groups: $resource( apiUrl + '/groups/:id', null, {
                'get': { method: 'GET' },
                'query': { method: 'GET', isArray: true },
                'update': { method: 'PUT' },
                'create': { method: 'POST' },
                'remove': { method: 'DELETE' }
            } )
        };

    } );