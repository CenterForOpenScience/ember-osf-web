import { ModelInstance, Server } from 'ember-cli-mirage';
import User from 'ember-osf-web/models/user';

/* eslint-disable-next-line */
export function cedarMetadataRecordsScenario(
    /* eslint-disable-next-line */
    server: Server,
    /* eslint-disable-next-line */
    currentUser: ModelInstance<User>,
/* eslint-disable-next-line */
) { 

    noCedarMetadataRecords(server);

    threeCedarMetadataRecords(server);

}

function threeCedarMetadataRecords(server: Server) {
    const newNode = server.create('node', {
        id: 'three-cedar-metadata-records',
    });

    const cedarMetadataRecords = server.createList('cedar-metadata-record', 3);

    newNode.update({
        cedarMetadataRecords,
    });
}


function noCedarMetadataRecords(server: Server) {
    server.create('node', {
        id: 'no-cedar-metadata-records',
    });
}
