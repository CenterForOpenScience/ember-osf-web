import { Factory } from 'ember-cli-mirage';
import CedarMetadataRecordModel from 'ember-osf-web/models/cedar-metadata-record';
import faker from 'faker';


export default Factory.extend<CedarMetadataRecordModel>({
    metadata() {
        return {
            name: faker.lorem.word(),
        };
    },

    isPublished() {
        return true;
    },
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'cedar-metadata-record': CedarMetadataRecordModel;
    } // eslint-disable-line semi
}


declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        'cedarMetadataRecords': CedarMetadataRecordModel;
    } // eslint-disable-line semi
}
