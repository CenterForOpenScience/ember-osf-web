import { Factory } from 'ember-cli-mirage';
import CedarMetadataRecordModel from 'ember-osf-web/models/cedar-metadata-record';
import faker from 'faker';


export default Factory.extend<CedarMetadataRecordModel>({
    metadata() {
        return {
            name: faker.lorem.word(),
            templates: [
                buildData(),
                buildData(),
                buildData(),
            ],
        };
    },

    isPublished() {
        return true;
    },
});

function buildData(): object {
    const record = Object({
        name: faker.lorem.sentence(6),
        data: [
            Object({
                key: faker.lorem.words(3),
                value: faker.lorem.sentence(50),
                required: faker.random.boolean(),

            }),
        ],
    });

    for(let index = 0; index < faker.random.number({min: 1, max: 9, precision: 1}); index++) {
        record.data.push(
            Object({
                key: faker.lorem.words(faker.random.number({min: 1, max: 5, precision: 1})),
                value: faker.lorem.sentence(50),
                required: faker.random.boolean(),
            }),
        );
    }

    return record;
}


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
