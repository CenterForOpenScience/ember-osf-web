import { Server } from 'ember-cli-mirage';


export function userScenario(server: Server) {
    server.create('user', {
        givenName: 'Tom',
        familyName: 'Brady',
    });

    server.create('user', {
        givenName: 'Harry',
        familyName: 'Bailey',
    });

    server.create('user', {
        givenName: 'George',
        familyName: 'Bailey',
    });

    server.create('user', {
        givenName: 'Taylor',
        familyName: 'Swift',
    });
}
