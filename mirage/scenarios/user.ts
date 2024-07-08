import { Server } from 'ember-cli-mirage';


export function userScenario(server: Server) {
    server.create('user', {
        givenName: 'Tom',
        familyName: 'Brady',
    });

    for(let i = 1; i < 20; i++) {
        server.create('user', {
            givenName: 'Tom',
            familyName: `Brady - ${i}`,
        });
    }

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
