import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import CustomFileMetadataRecord from 'ember-osf-web/models/custom-file-metadata-record';


export default Factory.extend<CustomFileMetadataRecord>({
    title: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    resource_type_general: 'text',
    language: 'en-US',
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        customFileMetadataRecords: CustomFileMetadataRecord;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        customFileMetadataRecords: CustomFileMetadataRecord;
    } // eslint-disable-line semi
}
