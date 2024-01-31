import { Server } from 'ember-cli-mirage';

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
    });
}

function threeCedarMetadataRecords(server: Server) {
    const newNode = server.create('node', {
        id: '3-cedar-records',
    });

    const cedarMetadataRecords = server.createList('cedar-metadata-record', 1);
    cedarMetadataRecords.push(server.create('cedar-metadata-record', 'isDraft'));
    cedarMetadataRecords.push(server.create('cedar-metadata-record', 'isTesting'));

    newNode.update({
        cedarMetadataRecords,
    });
}

function twelveCedarMetadataRecords(server: Server) {
    const newNode = server.create('node', {
        id: '12-cedar-records',
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
