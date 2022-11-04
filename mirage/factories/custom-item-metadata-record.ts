import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import CustomItemMetadataRecord from 'ember-osf-web/models/custom-item-metadata-record';


export default Factory.extend<CustomItemMetadataRecord>({
    resource_type_general: 'collection',
    language: 'en-US',
    funders: [
        {
            funder_name: faker.lorem.words(3),
            funder_identifier: faker.lorem.word,
            funder_identifier_type: 'Crossref',
            award_numer: '12345',
            award_uri: faker.internet.url,
            award_title: faker.lorem.sentence,
        },
        {
            funder_name: faker.lorem.words(3),
            funder_identifier: faker.lorem.word,
            funder_identifier_type: 'Crossref',
            award_numer: '67890',
            award_uri: faker.internet.url,
            award_title: faker.lorem.sentence,
        },
    ],
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'custom-item-metadata-records': CustomItemMetadataRecord;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        customItemMetadataRecords: CustomItemMetadataRecord;
    } // eslint-disable-line semi
}
