import { Factory, faker } from 'ember-cli-mirage';

import CollectedMetadatum from 'ember-osf-web/models/collected-metadatum';

import { guid, guidAfterCreate } from './utils';

export default Factory.extend<CollectedMetadatum>({
    id: guid('collected-metadatum'),
    afterCreate(collectedMetadatum, server) {
        guidAfterCreate(collectedMetadatum, server);
        const collectedType = faker.random.arrayElement(collectedMetadatum.collection.collectedTypeChoices);
        const issue = faker.random.arrayElement(collectedMetadatum.collection.issueChoices);
        const programArea = faker.random.arrayElement(collectedMetadatum.collection.programAreaChoices);
        const status = faker.random.arrayElement(collectedMetadatum.collection.statusChoices);
        const volume = faker.random.arrayElement(collectedMetadatum.collection.volumeChoices);
        collectedMetadatum.update({
            collectedType,
            issue,
            programArea,
            status,
            volume,
        });
    },
    collectedType: faker.lorem.word,
    issue: faker.lorem.word,
    programArea: faker.lorem.word,
    status: faker.lorem.word,
    volume: faker.lorem.word,
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        collectedMetadatum: CollectedMetadatum;
    } // eslint-disable-line semi
}
