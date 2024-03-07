import { Server } from 'ember-cli-mirage';
import { Permission } from 'ember-osf-web/models/osf-model';

/* eslint-disable-next-line */
export function cedarMetadataRecordsScenario(
    /* eslint-disable-next-line */
    server: Server) { 

    noCedarMetadataRecords(server);

    threeCedarMetadataRecords(server);

    twelveCedarMetadataRecords(server);

}

function noCedarMetadataRecords(server: Server) {
    server.create('node', {
        id: '0-cedar-records',
        currentUserPermissions: [Permission.Read, Permission.Admin, Permission.Write],
    });
}

function threeCedarMetadataRecords(server: Server) {
    const newNode = server.create('node', {
        id: '3-cedar-records',
        currentUserPermissions: [Permission.Read],
    });

    const cedarMetadataRecords = server.createList('cedar-metadata-record', 2);
    cedarMetadataRecords.push(server.create('cedar-metadata-record', 'isTesting'));

    newNode.update({
        cedarMetadataRecords,
    });
}

function twelveCedarMetadataRecords(server: Server) {
    const newNode = server.create('node', {
        id: '12-cedar-records',
        currentUserPermissions: [Permission.Read, Permission.Admin, Permission.Write],
    });
    const cedarMetadataRecords = server.createList('cedar-metadata-record', 8);
    cedarMetadataRecords.push(server.create('cedar-metadata-record', 'isDraft'));
    cedarMetadataRecords.push(server.create('cedar-metadata-record', 'isDraft'));
    cedarMetadataRecords.push(server.create('cedar-metadata-record', 'isDraft'));
    cedarMetadataRecords.push(server.create('cedar-metadata-record', 'isTesting'));

    newNode.update({
        cedarMetadataRecords,
    });
}
