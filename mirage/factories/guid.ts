import { Factory } from 'ember-cli-mirage';

import GuidModel from 'ember-osf-web/models/guid';

export default Factory.extend<GuidModel>({
    afterCreate(guid, server) {
        const metadataType = guid.referentType === 'file' ?
            'custom-file-metadata-record' : 'custom-item-metadata-record';
        server.create(metadataType, { id: guid.id });
    },
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        guids: GuidModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        guids: GuidModel;
    } // eslint-disable-line semi
}
