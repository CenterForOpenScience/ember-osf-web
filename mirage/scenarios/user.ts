import { Server } from 'ember-cli-mirage';


export function userScenario(server: Server) {
    server.create('user', {
        givenName: 'Tom',
        familyName: 'Brady',
    });
}
