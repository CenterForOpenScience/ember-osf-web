import { Server } from 'ember-cli-mirage';

export function meetingsScenario(server: Server) {
    server.create('meeting', {
        id: 'testmeeting',
        name: 'Test Meeting',
        submissions: server.createList('meeting-submission', 15),
    });
    server.createList('meeting', 25);
}
